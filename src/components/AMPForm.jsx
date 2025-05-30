// File: AMPForm.jsx
import React, { useState, useEffect } from 'react';

export default function AMPForm({ user, onSave, formRef }) {
  const [form, setForm] = useState({
    Date: '',
    Month: '',
    Name: user,
    'AMP Order#': '',
    'Customer Name': '',
    'TIM#': '',
    'TAT miss': 'NA',
    'Opportunity Status': 'Complete',
    Market: '',
    'Order Type': '',
    '$0': '',
    'SET lines': '',
    Phase: '',
  });

  useEffect(() => {
    const now = new Date();
    const shiftStart = new Date();
    shiftStart.setHours(17, 0, 0, 0); // 5pm
    const shiftDate = now >= shiftStart ? now : new Date(now.setDate(now.getDate() - 1));

    setForm(prev => ({
      ...prev,
      Date: shiftDate.toLocaleDateString(),
      Month: shiftDate.toLocaleString('default', { month: 'long' }),
    }));
  }, []);

  useEffect(() => {
    if (formRef) {
      formRef.current = {
        getFormData: () => form,
        resetForm: () => {
          setForm(prev =>
            Object.fromEntries(
              Object.keys(prev).map(k => [
                k,
                k === 'Date' || k === 'Month'
                  ? prev[k]
                  : k === 'TAT miss'
                  ? 'NA'
                  : k === 'Opportunity Status'
                  ? 'Complete'
                  : ''
              ])
            )
          );
        },
      };
    }
  }, [form, formRef]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    for (const key in form) {
      if (!form[key]) return alert(`Please fill ${key}`);
    }
    onSave(form);
    setForm(prev =>
      Object.fromEntries(
        Object.keys(prev).map(k => [
          k,
          k === 'Date' || k === 'Month'
            ? prev[k]
            : k === 'TAT miss'
            ? 'NA'
            : k === 'Opportunity Status'
            ? 'Complete'
            : ''
        ])
      )
    );
  };

  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {Object.entries(form).map(([key, val]) => {
        if (key === 'Phase') {
          return (
            <select
              key={key}
              name={key}
              value={val}
              onChange={handleChange}
              className="border px-2 py-1 rounded col-span-1"
            >
              <option value="">Select Phase</option>
              <option value="Phase 1">Phase 1</option>
              <option value="Phase 2">Phase 2</option>
              <option value="Phase 3">Phase 3</option>
              <option value="Phase 4">Phase 4</option>
            </select>
          );
        }
        return (
          <input
            key={key}
            name={key}
            value={val}
            placeholder={key}
            onChange={handleChange}
            className="border px-2 py-1 rounded col-span-1"
          />
        );
      })}
      {/* Hidden Save Button */}
      {/* <button
        onClick={handleSubmit}
        className="col-span-2 bg-green-600 text-white py-2 rounded mt-2 hidden"
      >
        Save AMP-OE Entry
      </button> */}
    </div>
  );
}
