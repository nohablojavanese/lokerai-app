import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Progress } from "@nextui-org/progress";
import {
  setLinkedInProfile,
  updatePersonalInfo,
  addEducation,
  addExperience,
  hydrate,
  initialState,
} from "../../redux/cvSlice";
import { blockedUsernames } from "@/lib/blockedusername";

const LinkedInProfileForm: React.FC = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const isBlockedUrl = (url: string) => {
    return blockedUsernames.some((username) => url.includes(username));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.startsWith("https://www.linkedin.com/in")) {
      setError(
        "Mohon masukan Link yang benar `https://www.linkedin.com/in/(username_kamu)"
      );
      return;
    }
    if (isBlockedUrl(url)) {
      setError("This LinkedIn profile is not allowed. Please use another URL. You try to dox me or what!?");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ linkedin_url: url }),
      });

      if (!response.ok) {
        throw new Error("Tidak Menemukan Profile LinkedIn");
      }

      const { data } = await response.json();

      // Dispatch LinkedIn profile data to Redux
      dispatch(setLinkedInProfile(data));

      // Update personal info
      dispatch(
        updatePersonalInfo({
          name: data.first_name,
          last: data.last_name,
          email: data.email || "",
          phone: data.phone || "",
          alamat: `${data.city || ""}, ${data.state || ""}, ${
            data.country || ""
          }`.trim(),
          ringkasan: data.about || "",
        })
      );

      // Add education
      data.educations.forEach((edu: any) => {
        dispatch(
          addEducation({
            school: edu.school,
            degree: edu.degree,
            graduationYear: edu.end_year,
          })
        );
      });

      // Add experience
      data.experiences.forEach((exp: any) => {
        dispatch(
          addExperience({
            company: exp.company,
            position: exp.title,
            startDate: `${exp.start_year}-${exp.start_month
              .toString()
              .padStart(2, "0")}`,
            endDate: exp.is_current
              ? "Present"
              : `${exp.end_year}-${exp.end_month.toString().padStart(2, "0")}`,
            description: exp.description,
          })
        );
      });

      setUrl("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearState = () => {
    dispatch(hydrate(initialState));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter your LinkedIn profile URL"
        type="url"
        required
        isInvalid={error !== null}
        errorMessage={error}
      />
      {isLoading && (
        <Progress isIndeterminate color="primary" className="mt-2" />
      )}
      <div className="flex justify-between mt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Import LinkedIn Profile"}
        </Button>
        <Button onClick={handleClearState} color="secondary">
          Clear All Data
        </Button>
      </div>
    </form>
  );
};

export default LinkedInProfileForm;
