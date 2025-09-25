"use client"

import { useState } from "react"
import "./IrrigationScheduler.css"

const IrrigationScheduler = ({ zones, onScheduleUpdate }) => {
  const [selectedZone, setSelectedZone] = useState(zones[0]?.id || 1)
  const [schedules, setSchedules] = useState([
    { id: 1, zoneId: 1, time: "06:00", duration: 30, days: ["Mon", "Wed", "Fri"], active: true },
    { id: 2, zoneId: 2, time: "07:00", duration: 25, days: ["Tue", "Thu", "Sat"], active: true },
    { id: 3, zoneId: 3, time: "18:00", duration: 20, days: ["Daily"], active: false },
  ])

  const [newSchedule, setNewSchedule] = useState({
    time: "06:00",
    duration: 30,
    days: [],
    active: true,
  })

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const handleDayToggle = (day) => {
    setNewSchedule((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }))
  }

  const handleAddSchedule = () => {
    if (newSchedule.days.length === 0) return

    const schedule = {
      id: Date.now(),
      zoneId: selectedZone,
      ...newSchedule,
    }

    setSchedules((prev) => [...prev, schedule])
    onScheduleUpdate([...schedules, schedule])

    // Reset form
    setNewSchedule({
      time: "06:00",
      duration: 30,
      days: [],
      active: true,
    })
  }

  const handleToggleSchedule = (scheduleId) => {
    setSchedules((prev) =>
      prev.map((schedule) => (schedule.id === scheduleId ? { ...schedule, active: !schedule.active } : schedule)),
    )
  }

  const handleDeleteSchedule = (scheduleId) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== scheduleId))
  }

  const getZoneName = (zoneId) => {
    const zone = zones.find((z) => z.id === zoneId)
    return zone ? zone.name : `Zone ${zoneId}`
  }

  return (
    <div className="irrigation-scheduler">
      <div className="scheduler-form">
        <h4>Add New Schedule</h4>

        <div className="form-row">
          <div className="form-group">
            <label>Zone</label>
            <select value={selectedZone} onChange={(e) => setSelectedZone(Number(e.target.value))}>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              value={newSchedule.time}
              onChange={(e) => setNewSchedule((prev) => ({ ...prev, time: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Duration (min)</label>
            <input
              type="number"
              min="5"
              max="120"
              value={newSchedule.duration}
              onChange={(e) => setNewSchedule((prev) => ({ ...prev, duration: Number(e.target.value) }))}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Days</label>
          <div className="days-selector">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                type="button"
                className={`day-button ${newSchedule.days.includes(day) ? "day-selected" : ""}`}
                onClick={() => handleDayToggle(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleAddSchedule} disabled={newSchedule.days.length === 0}>
          Add Schedule
        </button>
      </div>

      <div className="schedules-list">
        <h4>Current Schedules</h4>
        {schedules.length === 0 ? (
          <p className="no-schedules">No schedules configured</p>
        ) : (
          <div className="schedules-grid">
            {schedules.map((schedule) => (
              <div key={schedule.id} className={`schedule-item ${schedule.active ? "" : "schedule-inactive"}`}>
                <div className="schedule-header">
                  <div className="schedule-info">
                    <h5>{getZoneName(schedule.zoneId)}</h5>
                    <span className="schedule-time">{schedule.time}</span>
                  </div>
                  <div className="schedule-actions">
                    <button
                      className={`toggle-btn ${schedule.active ? "toggle-active" : ""}`}
                      onClick={() => handleToggleSchedule(schedule.id)}
                    >
                      {schedule.active ? "ON" : "OFF"}
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteSchedule(schedule.id)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="schedule-details">
                  <span className="schedule-duration">{schedule.duration} minutes</span>
                  <div className="schedule-days">{schedule.days.join(", ")}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default IrrigationScheduler
