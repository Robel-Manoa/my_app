import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { apiGet, apiPost } from "../api";

function FeedbackList(props) {
  return (
    <div className="feedback-list" data-aos="fade-left">
      {props.feedbackList.map((feedback) => (
        <div key={feedback.id} className="cardFeedback">
          <p>
            <strong>Subject:</strong>{" "}
            {feedback.subject || feedback.title || "Feedback"}
          </p>
          <p>
            <strong>Status:</strong> {feedback.status || "Submitted"}
          </p>
          <p>
            <strong>Message:</strong> {feedback.message}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function Feedback() {
  const [departments, setDepartments] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "IT",
    message: "",
  });

  useEffect(() => {
    const loadFeedbackData = async () => {
      try {
        const [departmentsResponse, feedbackResponse] = await Promise.all([
          apiGet("/departments"),
          apiGet("/feedback"),
        ]);
        setDepartments(departmentsResponse || []);
        setFeedbackList(feedbackResponse || []);
      } catch (err) {
        setError(err.message || "Unable to load feedback data");
      } finally {
        setLoading(false);
      }
    };

    AOS.init();
    loadFeedbackData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      await apiPost("/feedback", {
        subject: `${form.department} feedback`,
        message: `${form.message}\n\nFrom: ${form.name} (${form.email})`,
      });

      setSuccess("Feedback submitted successfully");
      setForm({
        name: "",
        email: "",
        department: form.department,
        message: "",
      });

      const refreshedFeedback = await apiGet("/feedback");
      setFeedbackList(refreshedFeedback || []);
    } catch (err) {
      setError(err.message || "Unable to submit feedback");
    }
  };

  return (
    <div className="body-page">
      <h1>Feedback List</h1>
      <p>
        We value your feedback! Please let us know your thoughts and
        suggestions.
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {loading ? (
        <p>Loading feedback…</p>
      ) : (
        <FeedbackList feedbackList={feedbackList} />
      )}

      <form
        className="feedback-form"
        data-aos="fade-up"
        onSubmit={handleSubmit}
      >
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label htmlFor="department">Department:</label>
        <select
          id="department"
          name="department"
          required
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
        >
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>

        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        ></textarea>

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
}
