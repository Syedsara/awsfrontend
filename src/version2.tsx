import React, { useEffect, useState } from 'react';
import './App.css'; // Replace 'Appv2.css' with the path to your CSS file

interface Patient {
  id: number;
  name: string;
  age: number;
}

function Appv2() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [sortedField, setSortedField] = useState<keyof Patient | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://hc-app-bk-env.eba-rwngmuxk.us-east-1.elasticbeanstalk.com/api/patients');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSort = (field: keyof Patient) => {
    if (field === sortedField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortedField(field);
      setSortOrder('asc');
    }
  };

  const handleSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://hc-app-bk-env.eba-rwngmuxk.us-east-1.elasticbeanstalk.com/api/patients/${id}`, {
        method: 'DELETE',
      });
      setPatients(patients.filter((patient) => patient.id !== id));
      setSelectedPatient(null);
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPatients = sortedField
    ? filteredPatients.slice().sort((a, b) => {
        const fieldA = a[sortedField];
        const fieldB = b[sortedField];
        if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      })
    : filteredPatients;

    return (
      <div className="app-container">
        <h1>Healthcare App v2</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search patient"
        />
        <div className="patient-grid">
      {sortedPatients.map((patient) => (
        <div
          key={patient.id}
          className={`patient ${selectedPatient === patient ? 'selected' : ''}`}
          onClick={() => handleSelect(patient)}
        >
          <h3 className="patient-name">{patient.name}</h3>
          <p className="patient-info">Age: {patient.age}</p>
          <button onClick={() => handleDelete(patient.id)}>Delete</button>
        </div>
      ))}
    </div>
        {selectedPatient && (
          <div>
            <h2>Selected Patient</h2>
            <p>Name: {selectedPatient.name}</p>
            <p>Age: {selectedPatient.age}</p>
          </div>
        )}
      </div>
    );
        }   
export default Appv2;