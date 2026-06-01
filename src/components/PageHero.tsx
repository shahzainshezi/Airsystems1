"use client";

import React from "react";

interface PageHeroProps {
  badge?: { icon: string; label: string };
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  bgImage?: string;
  bgType?: "image" | "dark";
  rightContent?: React.ReactNode;
  height?: string;
}

export default function PageHero({
  badge,
  title,
  titleHighlight,
  subtitle,
  bgImage,
  bgType = "image",
  rightContent,
  height,
}: PageHeroProps) {
  return (
    <div className="page-hero" style={height ? { height } : {}}>
      {/* Background */}
      {bgType === "image" && bgImage ? (
        <>
          <div className="page-hero-bg" style={{ backgroundImage: `url('${bgImage}')` }} />
          <div className="page-hero-overlay-img" />
          <div className="page-hero-overlay-side" />
        </>
      ) : (
        <>
          <div className="page-hero-bg-dark" />
          <div className="page-hero-blob-red" />
          <div className="page-hero-blob-purple" />
          <div className="page-hero-grid" />
          <div className="page-hero-fade" />
        </>
      )}

      {/* Content */}
      <div
        className="section-container page-hero-content"
        style={{ justifyContent: rightContent ? "space-between" : "flex-start" }}
      >
        <div>
          {badge && (
            <div className="page-hero-badge">
              <i className={`bx ${badge.icon}`} />
              <span>{badge.label}</span>
            </div>
          )}
          <h1 className="page-hero-title">
            {title}{" "}
            {titleHighlight && (
              <span className="page-hero-highlight">{titleHighlight}</span>
            )}
          </h1>
          {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
        </div>
        {rightContent && (
          <div className="page-hero-right">{rightContent}</div>
        )}
      </div>
    </div>
  );
}
