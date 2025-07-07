  import React, { createContext, useEffect, useState } from 'react';
  import { v4 as uuid } from 'uuid';

  export const DataContext = createContext();

  const samplePatients = [
  {
  id: 'p1',
  name: 'John Doe',
  dob: '1990-05-10',
  contact: '1234567890',
  healthInfo: 'No allergies'
  }
  ];

  const sampleIncidents = [
  {
  id: 'i1',
  patientId: 'p1',
  title: 'Toothache',
  description: 'Upper molar pain',
  comments: 'Sensitive to cold',
  appointmentDate: '2025-07-01T10:00:00',
  cost: 80,
  status: 'Completed',
  files: [
  { name: 'invoice.pdf', url: 'data:application/pdf;base64,...' },
  { name: 'xray.png', url: 'data:image/png;base64,...' }
  ]
  }
  ];

  export const DataProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [incidents, setIncidents] = useState([]);

  // Initialize storage
  useEffect(() => {
  if (!localStorage.getItem('patients')) {
  localStorage.setItem('patients', JSON.stringify(samplePatients));
  }
  if (!localStorage.getItem('incidents')) {
  localStorage.setItem('incidents', JSON.stringify(sampleIncidents));
  }
  setPatients(JSON.parse(localStorage.getItem('patients')));
  setIncidents(JSON.parse(localStorage.getItem('incidents')));
  }, []);

  // Sync helpers
  const syncPatients = (data) => {
  setPatients(data);
  localStorage.setItem('patients', JSON.stringify(data));
  };

  const syncIncidents = (data) => {
  setIncidents(data);
  localStorage.setItem('incidents', JSON.stringify(data));
  };

  // CRUD: Patients
  const addPatient = (patient) => {
  const newPatient = { ...patient, id: uuid() };
  const updated = [...patients, newPatient];
  syncPatients(updated);
  };

  const updatePatient = (id, updates) => {
  const updated = patients.map((p) => (p.id === id ? { ...p, ...updates } : p));
  syncPatients(updated);
  };

  const deletePatient = (id) => {
  const updated = patients.filter((p) => p.id !== id);
  syncPatients(updated);
  // Delete related incidents
  const incidentsLeft = incidents.filter((i) => i.patientId !== id);
  syncIncidents(incidentsLeft);
  };

  // CRUD: Incidents
  const addIncident = (incident) => {
  const newIncident = {
  ...incident,
  id: uuid(),
  files: incident.files || []
  };
  const updated = [...incidents, newIncident];
  syncIncidents(updated);
  };

  const updateIncident = (id, updates) => {
  const updated = incidents.map((i) =>
  i.id === id ? { ...i, ...updates } : i
  );
  syncIncidents(updated);
  };

  const deleteIncident = (id) => {
  const updated = incidents.filter((i) => i.id !== id);
  syncIncidents(updated);
  };

  return (
  <DataContext.Provider
  value={{
  patients,
  incidents,
  addPatient,
  updatePatient,
  deletePatient,
  addIncident,
  updateIncident,
  deleteIncident
  }}
  >
  {children}
  </DataContext.Provider>
  );
  };