'use client';

import { useState } from 'react';
import { SalesReport } from './reports/SalesReport';
import { UserReport } from './reports/UserReport';

export const ReportGenerator = () => {
  const [salesAmount, setSalesAmount] = useState<number>(0);
  const [usersAmount, setUsersAmount] = useState<number>(0);
  const [reportOutput, setReportOutput] = useState<string>('');

  const generateSalesReport = () => {
    const report = new SalesReport(salesAmount);
    setReportOutput(report.generateReport());
  };

  const generateUsersReport = () => {
    const report = new UserReport(usersAmount);
    setReportOutput(report.generateReport());
  };

  return (
    <div className='border mt-4 p-4 w-96 ml-5'>
      <h2>Report Generator - Template Method Pattern</h2>
      <div className='my-4'>
        <label htmlFor='salesAmount'>Sales Amount:</label>
        <input
          type='text'
          value={salesAmount}
          onChange={(e) => setSalesAmount(Number(e.target.value))}
          className='border rounded px-2 py-1 w-full mb-2'
        />
        <button
          onClick={generateSalesReport}
          className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer w-full'
        >
          Generate Sales Report
        </button>
      </div>
      <div>
        <label htmlFor='usersAmount'>Users Amount:</label>
        <input
          type='text'
          value={usersAmount}
          onChange={(e) => setUsersAmount(Number(e.target.value))}
          className='border rounded px-2 py-1 w-full mb-2'
        />
        <button
          onClick={generateUsersReport}
          className='bg-green-500 text-white px-4 py-2 rounded cursor-pointer w-full'
        >
          Generate Users Report
        </button>
      </div>
      {reportOutput && (
        <div className='mt-4 p-4 bg-gray-800 rounded'>
          <h3>Report Output:</h3>
          <pre>{reportOutput}</pre>
        </div>
      )}
    </div>
  );
};
