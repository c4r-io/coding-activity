'use client'
import React from "react";
import MystPreview from "./MystPreview";

const MystPreviewTwContainer = ({ data }) => {
  return (
    <div className="article prose prose-invert max-w-full text-inherit mystmd-preview-container">
      <MystPreview value={data} />
    </div>
  );
};

export default MystPreviewTwContainer;
