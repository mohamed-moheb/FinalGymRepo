import React, { useState, useEffect } from "react";
import "./UserDashboard.css";

const UserDashboard = () => {
  const userId = 13; 
  const [classes, setClasses] = useState([]);
  const [displayedClasses, setDisplayedClasses] = useState([]);
  const [bookedClasses, setBookedClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [invitationsLeft, setInvitationsLeft] = useState(0);
  const [invitationForm, setInvitationForm] = useState({
    invitedName: "",
    invitedAge: "",
    invitedEmail: "",
    invitedPhone: ""
  });
  const [invitationStatus, setInvitationStatus] = useState("");

  const staticClasses = [
    {
      id: 5,
      name: "Yoga",
      coachName: "Mohamed",
      dayOfWeek: "Tuesday",
      timeSlot: "7pm",
      duration: 60,
      availableSlots: 12
    },
    {
     id: 11,
     name: "Abs",
     coachName: "Marwan",
     dayOfWeek: "Monday",
     timeSlot: "8pm",
     duration: 60,
     availableSlots: 15
      },
    {
      id: 9,
      name: "Abs",
      coachName: "Jana",
      dayOfWeek: "Sunday",
      timeSlot: "8pm",
      duration: 60,
      availableSlots: 15
    },
    {
     id: 10,
     name: "MMA",
     coachName: "Essam",
     dayOfWeek: "Friday",
     timeSlot: "5pm",
     duration: 60,
     availableSlots: 15
      },
    {
      id: 8,
      name: "Boxing",
      coachName: "Youssef",
      dayOfWeek: "Monday",
      timeSlot: "5pm",
      duration: 60,
      availableSlots: 14
    }
  ];

  const fetchClasses = async () => {
    try {
      const response = await fetch("http://localhost:8888/classes");
      const data = await response.json();
      const updatedClasses = await Promise.all(
        data.map(async (classItem) => {
          const slotsResponse = await fetch(`http://localhost:8888/class/availability/${classItem.id}`);
          const slotsData = await slotsResponse.json();
          return { ...classItem, availableSlots: slotsData.availableSlots };
        })
      );
      setClasses(updatedClasses);
      setDisplayedClasses(updatedClasses);
    } catch (error) {
      console.error("Error fetching classes, using static data:", error);
      const updatedStaticClasses = await Promise.all(
        staticClasses.map(async (classItem) => {
          try {
            const slotsResponse = await fetch(`http://localhost:8888/class/availability/${classItem.id}`);
            const slotsData = await slotsResponse.json();
            return { ...classItem, availableSlots: slotsData.availableSlots };
          } catch {
            return classItem; 
          }
        })
      );
      setClasses(updatedStaticClasses);
      setDisplayedClasses(updatedStaticClasses);
    }
  };

  const fetchBookedClasses = async () => {
    const response = await fetch(`http://localhost:8888/user/bookings/${userId}`);
    const data = await response.json();
    setBookedClasses(data);
  };

  const fetchUserInvitations = async () => {
    const response = await fetch(`http://localhost:8888/user/${userId}/invitations`);
    const data = await response.json();
    setInvitationsLeft(data.invitationsLeft);
  };

  const handleSearch = () => {
    const filteredClasses = classes.filter((classItem) =>
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayedClasses(filteredClasses);
  };

  const handleClassBooking = async (classId) => {
    const response = await fetch("http://localhost:8888/class/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId, classId })
    });
    const data = await response.json();
    if (data.success) {
      alert("Class booked successfully!");
      fetchClasses();
      fetchBookedClasses();
    } else {
      alert(data.message || "Error booking class");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const response = await fetch(`http://localhost:8888/user/bookings/cancel/${bookingId}`, {
      method: "DELETE"
    });
    const data = await response.json();
    if (data.success) {
      alert("Booking canceled successfully!");
      fetchBookedClasses();
      fetchClasses();
    } else {
      alert(data.message || "Error canceling booking");
    }
  };

  const handleInvitationFormChange = (e) => {
    const { name, value } = e.target;
    setInvitationForm({
      ...invitationForm,
      [name]: value
    });
  };

  const handleInvitationSubmit = async (e) => {
    e.preventDefault();

    if (invitationsLeft <= 0) {
      setInvitationStatus("No invitations left.");
      return;
    }

    const { invitedName, invitedAge, invitedEmail, invitedPhone } = invitationForm;

    const response = await fetch("http://localhost:8888/user/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        invitedName,
        invitedAge,
        invitedEmail,
        invitedPhone
      })
    });

    const data = await response.json();

    if (data.success) {
      setInvitationsLeft((prev) => prev - 1);
      setInvitationStatus("Invitation sent successfully!");
      setInvitationForm({
        invitedName: "",
        invitedAge: "",
        invitedEmail: "",
        invitedPhone: ""
      });
      fetchUserInvitations();
    } else {
      setInvitationStatus(data.message || "Error sending invitation");
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchBookedClasses();
    fetchUserInvitations();
  }, []);

  return (
    <div className="dashboard">
      <h1>User Dashboard</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a class..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="invitations">
        <h2>Send Invitation</h2>
        <p>You have {invitationsLeft} invitations left.</p>
        <form onSubmit={handleInvitationSubmit}>
          <input
            type="text"
            name="invitedName"
            placeholder="Friend's Name"
            value={invitationForm.invitedName}
            onChange={handleInvitationFormChange}
            required
          />
          <input
            type="number"
            name="invitedAge"
            placeholder="Friend's Age"
            value={invitationForm.invitedAge}
            onChange={handleInvitationFormChange}
            required
          />
          <input
            type="email"
            name="invitedEmail"
            placeholder="Friend's Email"
            value={invitationForm.invitedEmail}
            onChange={handleInvitationFormChange}
            required
          />
          <input
            type="tel"
            name="invitedPhone"
            placeholder="Friend's Phone"
            value={invitationForm.invitedPhone}
            onChange={handleInvitationFormChange}
            required
          />
          <button type="submit" disabled={invitationsLeft <= 0}>Send Invitation</button>
        </form>
        {invitationStatus && <p>{invitationStatus}</p>}
      </div>

      <div className="classes">
        <h2>Available Classes</h2>
        <div className="class-list">
          {displayedClasses.length === 0 ? (
            <p>No classes available</p>
          ) : (
            displayedClasses.map((classItem) => (
              <div key={classItem.id} className="class-card">
                <h3>{classItem.name}</h3>
                <p>Coach: {classItem.coachName}</p>
                <p>Day: {classItem.dayOfWeek}</p>
                <p>Time: {classItem.timeSlot}</p>
                <p>Duration: {classItem.duration} minutes</p>
                <p>Available Slots: {classItem.availableSlots}</p>
                <button
                  onClick={() => handleClassBooking(classItem.id)}
                  disabled={classItem.availableSlots <= 0}
                >
                  {classItem.availableSlots <= 0 ? "Fully Booked" : "Book Class"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="booked-classes">
        <h2>Your Booked Classes</h2>
        <div className="booked-class-list">
          {bookedClasses.length === 0 ? (
            <p>No classes booked</p>
          ) : (
            bookedClasses.map((booking) => (
              <div key={booking.id} className="class-card">
                <h3>{booking.name}</h3>
                <p>Coach: {booking.coachName}</p>
                <p>Day: {booking.dayOfWeek}</p>
                <p>Time: {booking.timeSlot}</p>
                <p>Duration: {booking.duration} minutes</p>
                <button onClick={() => handleCancelBooking(booking.id)}>Cancel Booking</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
