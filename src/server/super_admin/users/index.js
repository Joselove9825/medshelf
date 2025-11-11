"use server"
import {client} from '@/sanity/lib/client';
import {hashPassword} from '@/lib/auth';

export const Fetch_Users = async () => {
    try {
        const response = await client.fetch(`
            *[_type == "libarian"] {
                _id,
                _createdAt,
                _updatedAt,
                first_name,
                last_name,
                email,
                is_email_verified,
                phone_number,
                role,
                is_active,
                status,
                "profile_picture": profile_picture.asset->url
            } | order(_createdAt desc)
        `);
        
        // Ensure profile_picture is a string URL or null
        const processedResponse = response.map(user => ({
            ...user,
            profile_picture: user.profile_picture || null
        }));
        
        if (response) {
            return {
                status: 200,
                type: 'success',
                success: true,
                data: response
            };
        }
        return{
            status: 200,
            type: 'success',
            success: true,
            data: []
        };
    }catch(error){
        console.log(error);
        return {
            status: 500,
            type: 'error',
            success: false,
            data: error
        };
    }
}

export const Fetch_Staff_Count = async() => {
    try {
        const count = await client.fetch(`
            count(*[_type == "libarian"])
        `);
        
        return {
            status: 200,
            type: 'success',
            success: true,
            data: count
        };
    } catch(error) {
        console.error('Error in Fetch_Staff_Count:', error);
        return {
            status: 500,
            type: 'error',
            success: false,
            data: 0
        };
    }
}

export const Add_Users = async (formData) => {
  // Convert FormData to plain object
  const formDataObj = Object.fromEntries(formData.entries());
  const { first_name, last_name, email, is_email_verified, phone_number, role, password } = formDataObj;
  
  try {
    // Check for existing user
    const existingUser = await client.fetch(
      `*[_type == "libarian" && email == $email][0]`,
      { email }
    );

    if (existingUser) {
      return {
        status: 400,
        type: 'failed',
        success: false,
        message: 'User with this email already exists'
      };
    }

    // Handle file upload if exists
    const file = formData.get('file');
    let profilePicture = null;
    
    if (file) {
      // Upload the file to Sanity
      const uploadedFile = await client.assets.upload('image', file);
      profilePicture = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: uploadedFile._id
        }
      };
    }

    // Create new user
    const newUser = {
      _type: 'libarian',
      first_name,
      last_name,
      email,
      is_email_verified: is_email_verified === 'true',
      phone_number,
      role: Array.isArray(role) ? role : [role],
      password: await hashPassword(password),
      is_active: true,
      status: 'active',
      profile_picture: profilePicture,
      createdAt: new Date().toISOString()
    };

    const createdUser = await client.create(newUser);

    return {
      status: 201,
      type: 'success',
      success: true,
      message: 'Staff member added successfully',
      data: createdUser
    };
  } catch (error) {
    console.error('Error in Add_Users:', error);
    return {
      status: 500,
      type: 'error',
      success: false,
      message: error.message || 'Failed to add staff member',
      data: error
    };
  }
}


export const Delete_Users = async (user_id) => {
    try {
        const response = await client.delete(user_id);
        
        if(response){
            return{
                status: 200,
                type: 'success',
                success: true,
                data: response,
                message: 'Staff member deleted successfully'
            }
        }

        return{
            status: 200,
            type: 'failed',
            success: false,
            data: []
        };
    }catch(error){
        console.log(error);
        return {
            status: 500,
            type: 'error',
            success: false,
            data: error
        };
    }
}

export const Update_Users = async (user_id, formData) => {
    try {
        // Convert FormData to plain object
        const formDataObj = Object.fromEntries(formData.entries());
        const { first_name, last_name, email, phone_number, role, password } = formDataObj;
        
        // Start building the patch
        const patch = client.patch(user_id);
        
        // Only include fields that have values
        if (first_name) patch.set({ first_name });
        if (last_name) patch.set({ last_name });
        if (email) patch.set({ email });
        if (phone_number) patch.set({ phone_number });
        if (role) patch.set({ role: [role] });
        
        // Handle password update if provided
        if (password) {
            const hashedPassword = await hashPassword(password);
            patch.set({ password: hashedPassword });
        }
        
        // Handle file upload if exists
        const file = formData.get('file');
        if (file) {
            const uploadedFile = await client.assets.upload('image', file);
            patch.set({
                profile_picture: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: uploadedFile._id
                    }
                }
            });
        }
        
        const response = await patch.commit();
        
        return {
            status: 200,
            type: 'success',
            success: true,
            data: response,
            message: 'Staff member updated successfully'
        };
        
    } catch(error) {
        console.error('Error updating user:', error);
        return {
            status: 500,
            type: 'error',
            success: false,
            message: error.message || 'Failed to update staff member',
            data: error
        };
    }
};