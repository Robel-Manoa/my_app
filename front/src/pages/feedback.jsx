import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { MockfeedbackList } from "../data/feedback";

function FeedbackList(props) {
  return (
    <div className="feedback-list" data-aos="fade-left">
      {props.feedbackList.map((feedback) => (
        <div key={feedback.id} className="cardFeedback">
          <p>
            <strong>Name:</strong> {feedback.name}
          </p>
          <p>
            <strong>Email:</strong> {feedback.email}{" "}
          </p>
          <p>
            <strong>Department:</strong> {feedback.department}
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
  const departments = [
    { id: 1, name: "IT" },
    { id: 2, name: "Marketing" },
    { id: 3, name: "Engineering" },
  ];
  const feedbackList = MockfeedbackList;

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="body-page">
      <h1>Feedback List</h1>
      <p>
        We value your feedback! Please let us know your thoughts and
        suggestions.
      </p>
      <FeedbackList feedbackList={feedbackList}></FeedbackList>
      <form className="feedback-form" data-aos="fade-up">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
        <label htmlFor="department">Department:</label>
        <select id="department" name="department" required>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
        <label htmlFor="message">Message:</label>
        <textarea id="message" name="message" required></textarea>
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
}
