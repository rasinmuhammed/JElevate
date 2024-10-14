import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const GamificationProgress = ({ points }) => {
  // Define thresholds for different levels based on points
  const levelThresholds = [
    { level: 'Beginner', points: 0, maxPoints: 250 },
    { level: 'Intermediate', points: 251, maxPoints: 500 },
    { level: 'Advanced', points: 501, maxPoints: 750 },
    { level: 'Expert', points: 751, maxPoints: 1000 },
  ];

  // Determine the current level and percentage
  const currentLevel = levelThresholds.find(threshold => points >= threshold.points && points <= threshold.maxPoints) || levelThresholds[0];
  const percentage = Math.min(((points - currentLevel.points) / (currentLevel.maxPoints - currentLevel.points)) * 100, 100);

  return (
    <div>
      <h6>Level: {currentLevel.level}</h6>
      <ProgressBar now={percentage} label={`${points} / ${currentLevel.maxPoints}`} />
      <p>Current Points: {points}</p>
    </div>
  );
};

export default GamificationProgress;
