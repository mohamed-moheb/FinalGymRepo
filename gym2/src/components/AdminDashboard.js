import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard() {
  const [classes, setClasses] = useState([]); // State for storing classes
  const [newClass, setNewClass] = useState({
    name: '',
    coachName: '',
    dayOfWeek: '',
    timeSlot: '',
    duration: '',
    availableSlots: '',
  });
  const [editingClass, setEditingClass] = useState(null); // Class being edited
  const [isEditing, setIsEditing] = useState(false); // Whether in editing mode

  // Fetch all classes from the backend
  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:8888/admin/classes');
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    fetchClasses(); // Fetch classes on component mount
  }, []);

  // Handle form input changes for new class
  const handleNewClassChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a new class
  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8888/admin/class/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClass),
      });
      if (!response.ok) throw new Error('Failed to add class');
      setNewClass({
        name: '',
        coachName: '',
        dayOfWeek: '',
        timeSlot: '',
        duration: '',
        availableSlots: '',
      });
      fetchClasses(); // Refresh the classes list
    } catch (error) {
      console.error('Error adding class:', error);
    }
  };

  // Edit a class
  const handleEditClass = (classItem) => {
    setEditingClass({ ...classItem }); // Populate the editing form
    setIsEditing(true);
  };

  // Handle form input changes for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingClass((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit updated class details
  const handleUpdateClass = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8888/admin/class/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: editingClass.id, // Pass class ID
          coachName: editingClass.coachName,
          timeSlot: editingClass.timeSlot,
          dayOfWeek: editingClass.dayOfWeek,
          duration: editingClass.duration,
          availableSlots: editingClass.availableSlots,
        }),
      });
      if (!response.ok) throw new Error('Failed to update class');
      const data = await response.json();
      setClasses(data.classes); // Update classes state
      setIsEditing(false); // Exit editing mode
      setEditingClass(null); // Clear editing state
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };

  // Delete a class
  const handleDeleteClass = async (classId) => {
    try {
      const response = await fetch('http://localhost:8888/admin/class/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId }),
      });
      if (!response.ok) throw new Error('Failed to delete class');
      fetchClasses(); // Refresh the classes list
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  return (
    <div className="page-container1">
      <h1>Admin Dashboard</h1>
      <h2>Manage Classes</h2>

      {/* Add New Class Form */}
      {!isEditing && (
        <form onSubmit={handleAddClass}>
          <h3>Add New Class</h3>
          <input
            type="text"
            name="name"
            value={newClass.name}
            onChange={handleNewClassChange}
            placeholder="Class Name"
            required
          />
          <input
            type="text"
            name="coachName"
            value={newClass.coachName}
            onChange={handleNewClassChange}
            placeholder="Coach Name"
            required
          />
          <input
            type="text"
            name="dayOfWeek"
            value={newClass.dayOfWeek}
            onChange={handleNewClassChange}
            placeholder="Day of the Week"
            required
          />
          <input
            type="text"
            name="timeSlot"
            value={newClass.timeSlot}
            onChange={handleNewClassChange}
            placeholder="Time Slot"
            required
          />
          <input
            type="number"
            name="duration"
            value={newClass.duration}
            onChange={handleNewClassChange}
            placeholder="Duration (minutes)"
            required
          />
          <input
            type="number"
            name="availableSlots"
            value={newClass.availableSlots}
            onChange={handleNewClassChange}
            placeholder="Available Slots"
            required
          />
          <button type="submit">Add Class</button>
        </form>
      )}

      {/* Edit Class Form */}
      {isEditing && editingClass && (
        <form onSubmit={handleUpdateClass}>
          <h3>Edit Class</h3>
          <input
            type="text"
            name="coachName"
            value={editingClass.coachName}
            onChange={handleEditChange}
            placeholder="Coach Name"
            required
          />
          <input
            type="text"
            name="dayOfWeek"
            value={editingClass.dayOfWeek}
            onChange={handleEditChange}
            placeholder="Day of the Week"
            required
          />
          <input
            type="text"
            name="timeSlot"
            value={editingClass.timeSlot}
            onChange={handleEditChange}
            placeholder="Time Slot"
            required
          />
          <input
            type="number"
            name="duration"
            value={editingClass.duration}
            onChange={handleEditChange}
            placeholder="Duration (minutes)"
            required
          />
          <input
            type="number"
            name="availableSlots"
            value={editingClass.availableSlots}
            onChange={handleEditChange}
            placeholder="Available Slots"
            required
          />
          <button type="submit">Update Class</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      )}

      {/* Classes List */}
      <div className="classes-list-container">
        <h3>Class List</h3>
        <ul>
          {classes.map((classItem) => (
            <li key={classItem.id}>
              <p>
                <strong>{classItem.name}</strong><br />
                Coach: {classItem.coachName}<br />
                Day: {classItem.dayOfWeek}<br />
                Time: {classItem.timeSlot}<br />
                Duration: {classItem.duration} mins<br />
                Available Slots: {classItem.availableSlots}
              </p>
              <div>
                <button onClick={() => handleEditClass(classItem)}>Edit</button>
                <button onClick={() => handleDeleteClass(classItem.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;
