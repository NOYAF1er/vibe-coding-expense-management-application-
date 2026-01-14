import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NewReportHeader } from '../components/NewReportHeader';
import { TextInput } from '../components/TextInput';
import { DateInput } from '../components/DateInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { createExpenseReport } from '../services/expenseReports.api';

/**
 * New Report Page
 * Allows users to create a new expense report
 */
export function NewReportPage() {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleCreateReport = async () => {
    if (!purpose.trim() || !date) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createExpenseReport({
        title: purpose,
        reportDate: date,
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to create expense report:', error);
      setIsSubmitting(false);
    }
  };

  const isFormValid = purpose.trim() !== '' && date !== '';

  return (
    <div className="flex flex-col h-screen justify-between">
      <main className="flex-grow">
        <NewReportHeader onClose={handleClose} />
        <div className="p-4 space-y-6">
          <TextInput
            id="purpose"
            label="Purpose"
            placeholder="e.g. Q3 Client Meeting"
            value={purpose}
            onChange={setPurpose}
          />
          <DateInput
            id="date"
            label="Date"
            value={date}
            onChange={setDate}
          />
        </div>
      </main>
      <footer className="p-4 pb-8">
        <div className="flex items-center space-x-4">
          <PrimaryButton
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton
            variant="primary"
            onClick={handleCreateReport}
            disabled={!isFormValid || isSubmitting}
          >
            Create Report
          </PrimaryButton>
        </div>
      </footer>
    </div>
  );
}
