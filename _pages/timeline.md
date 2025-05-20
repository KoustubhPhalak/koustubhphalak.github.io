---
title: "Research Timeline"
permalink: /research-timeline/
author_profile: true
---

<style>
/* Reset minimal-mistakes theme settings */
.page {
  width: 100% !important;
  padding: 0 !important;
  float: none !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.page__content {
  width: 100% !important;
  padding: 0 !important;
  float: none !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.page__inner-wrap {
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

.page__header {
  margin-bottom: 0 !important;
}

/* Main container for the timeline */
.timeline-container {
  position: relative;
  width: 85%;
  margin-left: 220px; /* Adjust based on your sidebar width */
  padding: 0; /* Remove top padding */
  margin-top: 0;
}

/* Page title - move it to prevent overlap */
h1.page__title, 
.page__title {
  margin-left: 220px; /* Match container margin */
  padding-top: 0; /* Remove top padding */
  padding-bottom: 0;
  margin-top: 0; /* Remove top margin */
  margin-bottom: 10px !important;
}

/* The vertical line */
.timeline {
  position: relative;
  width: 100%;
  padding: 0; /* Remove vertical padding */
}

.timeline::after {
  content: '';
  position: absolute;
  width: 6px;
  background-color: #3498db;
  top: 0;
  bottom: 0;
  left: 60px; /* Position line on the left */
  margin-left: -3px;
  z-index: 0;
}

/* Container for each timeline item */
.container {
  position: relative;
  background-color: inherit;
  width: calc(100% - 100px); /* Width minus the space for the line and some padding */
  margin-left: 100px; /* Space for the timeline and circle */
  margin-bottom: 30px;
}

/* The circles on the timeline */
.container::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: -58px; /* Adjusted for perfect alignment */
  background-color: white;
  border: 3px solid #3498db;
  top: 22px;
  border-radius: 50%;
  z-index: 1;
  /* Ensure center of circle aligns with timeline */
  margin-left: -1px;
}

/* Content styling */
.content {
  padding: 20px 30px;
  background-color: #f2f2f2;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.content:hover {
  box-shadow: 0 5px 12px rgba(0,0,0,0.15);
  transform: translateX(5px);
}

/* Arrow pointing to the timeline */
.content::before {
  content: " ";
  height: 0;
  position: absolute;
  top: 22px;
  width: 0;
  z-index: 1;
  left: -10px;
  border: medium solid #f2f2f2;
  border-width: 10px 10px 10px 0;
  border-color: transparent #f2f2f2 transparent transparent;
}

/* Content styling */
.content h2 {
  margin-top: 0;
  color: #3498db;
  font-size: 1.5em;
}

.date {
  color: #6c757d;
  font-style: italic;
  margin-bottom: 15px;
  display: block;
}

.content p, .content ul {
  margin-bottom: 10px;
  font-size: 1em;
  line-height: 1.6;
}

.content ul {
  padding-left: 20px;
}

.content li {
  margin-bottom: 5px;
}

/* Alternating colors */
.container:nth-child(odd) .content {
  background-color: #f9f9f9;
}

.container:nth-child(odd) .content::before {
  border-color: transparent #f9f9f9 transparent transparent;
}

/* Responsive layout */
@media screen and (max-width: 1024px) {
  .timeline-container {
    width: 90%;
    margin-left: 100px;
  }
}

@media screen and (max-width: 768px) {
  .timeline-container {
    width: 100%;
    margin-left: 0;
    padding: 0 15px;
  }
  
  h1.page__title, 
  .page__title {
    margin-left: 15px; /* Reduce margin on mobile */
    margin-top: 0;
  }
  
  .timeline::after {
    left: 30px;
  }
  
  .container {
    margin-left: 70px;
    width: calc(100% - 85px);
  }
  
  .container::before {
    left: -42px; /* Adjust circle position for mobile */
    transform: translateX(50%); /* Maintain centering */
  }
}

@media screen and (max-width: 480px) {
  .content {
    padding: 15px 20px;
  }
  
  .container {
    margin-left: 60px;
    width: calc(100% - 75px);
  }
}
</style>

<div class="timeline-container">
  <div class="timeline">
    <div class="container">
      <div class="content">
        <h2>Doctoral Research</h2>
        <span class="date">2022 - Present</span>
        <p>Working on novel approaches to machine learning models for computer vision applications. Focus on developing efficient deep learning architectures for real-time object detection in resource-constrained environments.</p>
        <p>Key achievements:</p>
        <ul>
          <li>Developed a lightweight CNN architecture that achieves 95% accuracy while using 40% fewer parameters</li>
          <li>Published findings in top-tier conferences including CVPR and ICCV</li>
          <li>Collaborated with industry partners to implement solutions in embedded systems</li>
        </ul>
      </div>
    </div>
    
    <div class="container">
      <div class="content">
        <h2>Master's Thesis Research</h2>
        <span class="date">2020 - 2022</span>
        <p>Investigated transfer learning techniques for medical image analysis. Focused on applying deep learning to improve diagnostic accuracy in radiological images.</p>
        <p>Key outcomes:</p>
        <ul>
          <li>Designed a novel transfer learning approach that improved classification accuracy by 17%</li>
          <li>Implemented a prototype system that was tested in collaboration with University Hospital</li>
          <li>Research led to two journal publications in IEEE Transactions on Medical Imaging</li>
        </ul>
      </div>
    </div>
    
    <div class="container">
      <div class="content">
        <h2>Research Internship at Tech Corp</h2>
        <span class="date">Summer 2019</span>
        <p>Worked with the R&D team on developing computer vision algorithms for autonomous navigation systems. Focused on real-time obstacle detection and avoidance.</p>
        <p>Contributions:</p>
        <ul>
          <li>Implemented and optimized SLAM algorithms for indoor navigation</li>
          <li>Developed a simulation environment for testing navigation algorithms</li>
          <li>Work resulted in a patent application for a novel sensor fusion approach</li>
        </ul>
      </div>
    </div>
    
    <div class="container">
      <div class="content">
        <h2>First paper: Quantum PUF</h2>
        <span class="date">Fall 2020-Spring 2021</span>
        <p>Wrote my first PhD paper on fingerprinting quantum hardware</p>
        <p>Accomplishments:</p>
        <ul>
          <li>Ran experiments on real quantum hardware</li>
          <li>Distinguishable results for both strong and weak PUFs</li>
          <li>Superposition and Decoherence-based PUFs</li>
        </ul>
      </div>
    </div>
    
    <div class="container">
      <div class="content">
        <h2>PhD started</h2>
        <span class="date">Fall 2020</span>
        <p>Started research in Quantum Computing</p>
      </div>
    </div>
  </div>
</div>