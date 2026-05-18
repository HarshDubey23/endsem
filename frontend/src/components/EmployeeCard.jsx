const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  return (
    <div className="employee-card">
      <h3>{employee.name}</h3>
      <p>
        <strong>Email:</strong> {employee.email}
      </p>
      <p>
        <strong>Department:</strong> {employee.department}
      </p>
      <p>
        <strong>Experience:</strong> {employee.experience} years
      </p>
      <span className="score-badge">
        Score: {employee.performanceScore}/100
      </span>
      {employee.skills && employee.skills.length > 0 && (
        <div className="skills-tags">
          {employee.skills.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      )}
      <div className="card-actions">
        <button className="btn-edit" onClick={() => onEdit(employee)}>
          Edit
        </button>
        <button className="btn-delete" onClick={() => onDelete(employee._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
