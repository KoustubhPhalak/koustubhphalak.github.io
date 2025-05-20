---
title: "Research Timeline"
permalink: /research-timeline/
author_profile: true
---

<style>
/* Reset minimal-mistakes theme settings that cause conflicts */
.page {
  width: 100% !important;
  padding: 0 !important;
  float: none !important;
}

.sidebar {
  opacity: 1;
  -webkit-transition: opacity 0.2s ease-in-out;
  transition: opacity 0.2s ease-in-out;
}

.page__content {
  width: 100% !important;
  padding: 0 !important;
  float: none !important;
}

.page__inner-wrap {
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* Create a full-width container for our timeline */
.timeline-wrapper {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  overflow: hidden;
  margin-left: 300px; /* Adjust based on your sidebar width */
}

/* Main timeline with vertical line */
.timeline {
  position: relative;
  width: 100%;
  margin: 0 0 0 -50px; /* Pull timeline to the left to make more room */
  padding: 30px 0;
}

/* Vertical line */
.timeline::after {
  content: '';
  position: absolute;
  width: 6px;
  background-color: #3498db;
  top: 0;
  bottom: 0;
  left: 20%; /* Position line at 20% to give more room for content */
  margin-left: -3px;
}

/* Timeline containers */
.container {
  position: relative;
  width: 100%;
  padding: 20px 0;
  clear: both;
}

/* Container content */
.content {
  padding: 25px 35px;
  background-color: #f2f2f2;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  max-width: 75%; /* Make content boxes very wide */
  margin-left: 25%; /* Position after the timeline */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Hover effect */
.content:hover {
  transform: translateX(5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

/* Circle markers */
.container::before {
  content: '';
  position: absolute;
  width: 25px;
  height: 25px;
  background-color: white;
  border: 4px solid #3498db;
  border-radius: 50%;
  top: 35px;
  left: 20%;
  margin-left: -16px;
  z-index: 1;
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

/* Alternating content (optional) */
.container:nth-child(odd) .content {
  background-color: #f9f9f9;
}

/* Mobile responsiveness */
@media screen and (max-width: 1024px) {
  .timeline-wrapper {
    margin-left: 100px;
  }
  
  .timeline::after {
    left: 50px;
  }
  
  .container::before {
    left: 50px;
  }
  
  .content {
    margin-left: 100px;
    max-width: calc(100% - 150px);
  }
}

@media screen and (max-width: 768px) {
  .timeline-wrapper {
    margin-left: 0;
    padding: 0 15px;
  }
  
  .timeline {
    margin: 0;
  }
  
  .timeline::after {
    left: 30px;
  }
  
  .container::before {
    left: 30px;
  }
  
  .content {
    margin-left: 70px;
    max-width: calc(100% - 90px);
    padding: 15px 20px;
  }
}
</style>

<div class="timeline-wrapper">
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