import  { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

const EmployeeManager = () => {
    const [employees, setEmployees] = useState([]);
    const [employee, setEmployee] = useState({
      id: '',
      name: '',
      gender: '',
      department: '',
      designation: '',
      salary: '',
      email: '',
      password: '',
      contact: ''
    });
    const [idToFetch, setIdToFetch] = useState('');
    const [fetchedEmployee, setFetchedEmployee] = useState(null);
    const [message, setMessage] = useState('');
    const [editMode, setEditMode] = useState(false);
  
    const baseUrl = `${import.meta.env.VITE_API_URL}/employeeapi`;
  
    useEffect(() => {
        fetchAllEmployees();
      }, []);
  
    const fetchAllEmployees = async () => {
      try {
        const res = await axios.get(`${baseUrl}/all`);
        setEmployees(res.data);
      } catch (error) {
        console.error('Error:', error);
        setMessage('Failed to fetch employees.');
      }
    };
  
    const handleChange = (e) => {
      const value = e.target.name === 'salary' ? parseFloat(e.target.value) : e.target.value;
      setEmployee({ ...employee, [e.target.name]: value });
    };
  
    const validateForm = () => {
      for (let key in employee) {
        if (!employee[key] || employee[key].toString().trim() === '') {
          setMessage(`Please fill out the ${key} field.`);
          return false;
        }
      }
      return true;
    };
  
    const addEmployee = async () => {
      if (!validateForm()) return;
      try {
        await axios.post(`${baseUrl}/add`, employee);
        setMessage('Employee added successfully.');
        fetchAllEmployees();
        resetForm();
      } catch (error) {
        console.error('Error:', error);
        setMessage('Error adding employee.');
      }
    };
  
    const updateEmployee = async () => {
      if (!validateForm()) return;
      try {
        await axios.put(`${baseUrl}/update`, employee);
        setMessage('Employee updated successfully.');
        fetchAllEmployees();
        resetForm();
      } catch (error) {
        console.error('Error:', error);
        setMessage('Error updating employee.');
      }
    };
  
    const deleteEmployee = async (id) => {
      try {
        const res = await axios.delete(`${baseUrl}/delete/${id}`);
        setMessage(res.data);
        fetchAllEmployees();
      } catch (error) {
        console.error('Error:', error);
        setMessage('Error deleting employee.');
      }
    };
  
    const getEmployeeById = async () => {
      try {
        const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
        setFetchedEmployee(res.data);
        setMessage('');
      } catch (error) {
        console.error('Error:', error);
        setFetchedEmployee(null);
        setMessage('Employee not found.');
      }
    };
  
    const handleEdit = (emp) => {
      setEmployee(emp);
      setEditMode(true);
      setMessage(`Editing employee with ID ${emp.id}`);
    };
  
    const resetForm = () => {
      setEmployee({
        id: '',
        name: '',
        gender: '',
        department: '',
        designation: '',
        salary: '',
        email: '',
        password: '',
        contact: ''
      });
      setEditMode(false);
    };
  
    return (
      <div className="employee-container">
  
        {message && (
          <div className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
  
        <h2>Employee Management</h2>
  
        <div>
          <h3>{editMode ? 'Edit Employee' : 'Add Employee'}</h3>
          <div className="form-grid">
            <input type="number" name="id" placeholder="ID" value={employee.id} onChange={handleChange} />
            <input type="text" name="name" placeholder="Name" value={employee.name} onChange={handleChange} />
            <select name="gender" value={employee.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>
            <select name="department" value={employee.department} onChange={handleChange}>
    <option value="">Select Department</option>
    <option value="HR">Human Resources</option>
    <option value="FINANCE">Finance & Accounting</option>
    <option value="MARKETING">Marketing</option>
    <option value="SALES">Sales</option>
    <option value="IT">Information Technology</option>
    <option value="OPERATIONS">Operations</option>
    <option value="R&D">Research & Development</option>
    <option value="LEGAL">Legal</option>
    <option value="ADMIN">Administration</option>
    <option value="PROCUREMENT">Procurement</option>
    <option value="QA">Quality Assurance</option>
    <option value="BD">Business Development</option>
    <option value="DESIGN">Design / Creative</option>
    <option value="PR">Public Relations</option>
  </select>
  
  <select name="designation" value={employee.designation} onChange={handleChange}>
    <option value="">Select Designation</option>
    <option value="INTERN">Intern</option>
    <option value="JUNIOR ENGINEER">Junior Engineer</option>
    <option value="SENIOR ENGINEER">Senior Engineer</option>
    <option value="TEAM LEAD">Team Lead</option>
    <option value="MANAGER">Manager</option>
    <option value="SENIOR MANAGER">Senior Manager</option>
    <option value="DIRECTOR">Director</option>
    <option value="VP">Vice President</option>
    <option value="CEO">CEO</option>
    <option value="HR EXECUTIVE">HR Executive</option>
    <option value="FINANCE ANALYST">Finance Analyst</option>
    <option value="MARKETING EXECUTIVE">Marketing Executive</option>
  </select>
  
  <input type="number" name="salary" placeholder="Salary" value={employee.salary} onChange={handleChange} />
  <input type="email" name="email" placeholder="Email" value={employee.email} onChange={handleChange} />
  <input type="password" name="password" placeholder="Password" value={employee.password} onChange={handleChange} />
  <input type="text" name="contact" placeholder="Contact" value={employee.contact} onChange={handleChange} />
  
          </div>
  
          <div className="btn-group">
            {!editMode ? (
              <button className="btn-blue" onClick={addEmployee}>Add Employee</button>
            ) : (
              <>
                <button className="btn-green" onClick={updateEmployee}>Update Employee</button>
                <button className="btn-gray" onClick={resetForm}>Cancel</button>
              </>
            )}
          </div>
        </div>
  
        <div>
          <h3>Get Employee By ID</h3>
          <input
            type="number"
            value={idToFetch}
            onChange={(e) => setIdToFetch(e.target.value)}
            placeholder="Enter ID"
          />
          <button className="btn-blue" onClick={getEmployeeById}>Fetch</button>
  
          {fetchedEmployee && (
            <div>
              <h4>Employee Found:</h4>
              <pre>{JSON.stringify(fetchedEmployee, null, 2)}</pre>
            </div>
          )}
        </div>
  
        <div>
          <h3>All Employees</h3>
          {employees.length === 0 ? (
            <p>No employees found.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    {Object.keys(employee).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      {Object.keys(employee).map((key) => (
                        <td key={key}>{emp[key]}</td>
                      ))}
                      <td>
                        <div className="action-buttons">
                          <button className="btn-green" onClick={() => handleEdit(emp)}>Edit</button>
                          <button className="btn-red" onClick={() => deleteEmployee(emp.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
  
      </div>
    );
  };
  
  export default EmployeeManager;
  