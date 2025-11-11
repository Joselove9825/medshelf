"use client"; // if you're using Next.js App Router

import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", value: 100 },
  { name: "Tue", value: 300 },
  { name: "Wed", value: 200 },
  { name: "Thu", value: 400 },
  { name: "Fri", value: 250 },
];

const LineChart_medshelf = () => {
  return (
    <div className='w-full h-64 min-h-[300px]'>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
        <RechartsLineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};



const BarChart_medshelf = () => {
  return (
    <div className='w-full h-64 min-h-[300px]'>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
        <RechartsBarChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};


// add pie chart

export { LineChart_medshelf, BarChart_medshelf };
