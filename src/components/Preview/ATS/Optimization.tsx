import React, { useEffect, useState } from "react";
import { CVState } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface ATSAnalyzerProps {
  cv: CVState;
}

interface ATSResult {
  score: number;
  suggestions: string[];
  sectionScores: Record<string, number>;
}

const ATSAnalyzer: React.FC<ATSAnalyzerProps> = ({ cv }) => {
  const [atsResult, setAtsResult] = useState<ATSResult>({
    score: 0,
    suggestions: [],
    sectionScores: {},
  });

  const analyzeATS = () => {
    let score = 100;
    const suggestions: string[] = [];
    const sectionScores: Record<string, number> = {};

    // Keywords analysis
    const keywords = [
      "leadership",
      "teamwork",
      "communication",
      "problem-solving",
      "project management",
      "analytical skills",
      "customer service",
      "time management",
      "adaptability",
      "creativity",
    ];
    const cvText = JSON.stringify(cv).toLowerCase();
    const keywordsFound = keywords.filter((keyword) =>
      cvText.includes(keyword)
    );
    const keywordScore = (keywordsFound.length / keywords.length) * 25;
    score -= 25 - keywordScore;
    sectionScores.keywords = keywordScore;

    if (keywordsFound.length < keywords.length) {
      suggestions.push(
        `Consider adding some of these keywords if relevant: ${keywords
          .filter((k) => !keywordsFound.includes(k))
          .join(", ")}`
      );
    }

    // Education analysis
    const eduScore = Math.min(cv.education.length * 5, 15);
    score -= 15 - eduScore;
    sectionScores.education = eduScore;

    if (cv.education.length === 0) {
      suggestions.push(
        "Add your educational background for a more complete CV."
      );
    } else if (cv.education.length < 2) {
      suggestions.push(
        "Consider adding more educational experiences if available."
      );
    }

    // Experience analysis
    let expScore = 0;
    cv.experience.forEach((exp) => {
      expScore += 5; // Base score for each experience
      if (exp.description && exp.description.split(" ").length >= 30) {
        expScore += 5; // Bonus for detailed description
      }
    });
    expScore = Math.min(expScore, 30);
    score -= 30 - expScore;
    sectionScores.experience = expScore;

    if (cv.experience.length === 0) {
      suggestions.push("Include your work experience to strengthen your CV.");
    } else {
      cv.experience.forEach((exp) => {
        if (!exp.description || exp.description.split(" ").length < 30) {
          suggestions.push(
            `Expand the description for your role at ${exp.company}. Aim for at least 30 words.`
          );
        }
      });
    }

    // Skills analysis
    const skillScore = Math.min(cv.skills.length * 2, 15);
    score -= 15 - skillScore;
    sectionScores.skills = skillScore;

    if (cv.skills.length < 5) {
      suggestions.push(
        "List more relevant skills to improve your CV's ATS score. Aim for at least 5 skills."
      );
    }

    // Personal Info analysis
    let personalInfoScore = 15;
    if (!cv.personalInfo.name) {
      personalInfoScore -= 5;
      suggestions.push("Make sure to include your full name.");
    }
    if (!cv.personalInfo.email) {
      personalInfoScore -= 5;
      suggestions.push("Add your email address for contact information.");
    }
    if (!cv.personalInfo.phone) {
      personalInfoScore -= 5;
      suggestions.push(
        "Include your phone number for potential employers to reach you."
      );
    }
    score -= 15 - personalInfoScore;
    sectionScores.personalInfo = personalInfoScore;

    setAtsResult({
      score: Math.max(0, Math.round(score)),
      suggestions,
      sectionScores,
    });
  };

  useEffect(() => {
    analyzeATS();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cv]);

  return (
    <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
        ATS Optimization Analysis
      </h2>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold">Overall Score:</span>
          <span className="text-lg font-bold">{atsResult.score}%</span>
        </div>
        <Progress value={atsResult.score} className="w-full h-2" />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.entries(atsResult.sectionScores).map(([section, score]) => (
          <div
            key={section}
            className="bg-gray-100 dark:bg-gray-700 p-3 rounded"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">
                {section.charAt(0).toUpperCase() + section.slice(1)}:
              </span>
              <span>{score}%</span>
            </div>
            <Progress value={score} className="w-full h-1" />
          </div>
        ))}
      </div>
      {atsResult.suggestions.length > 0 && (
        <Alert>
          <AlertTitle>Suggestions for improvement:</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2">
              {atsResult.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ATSAnalyzer;
