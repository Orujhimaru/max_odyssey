import React from "react";
import "./SkillStack.css";

const SkillStack = () => {
  const getColor = (score) => {
    // Interpolate between #456bc4 (blue) and #4e4e4e (gray)
    const startColor = { r: 69, g: 107, b: 196 }; // #456bc4
    const endColor = { r: 78, g: 78, b: 78 }; // #4e4e4e

    const r = Math.round(
      startColor.r + (endColor.r - startColor.r) * (1 - score / 100)
    );
    const g = Math.round(
      startColor.g + (endColor.g - startColor.g) * (1 - score / 100)
    );
    const b = Math.round(
      startColor.b + (endColor.b - startColor.b) * (1 - score / 100)
    );

    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="skill-stack">
      {skills.map((skill) => (
        <div key={skill.id} className="skill-item">
          <div className="skill-header">
            <div className="skill-label">
              <div className="skill-number">{skill.id}</div>
              <div className="skill-name">{skill.name}</div>
            </div>
            <div
              className="skill-score"
              style={{ color: getColor(skill.score) }}
            >
              {skill.score}%
            </div>
          </div>
          <div className="skill-progress-container"></div>
        </div>
      ))}
    </div>
  );
};

export default SkillStack;
