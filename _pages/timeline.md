---
title: "Research Timeline"
permalink: /research-timeline/
author_profile: true
classes: wide
---

<style>
/* Reset for page container to respect sidebar */
.page {
  width: calc(100% - 300px) !important;
  float: right !important;
  margin-right: 0 !important;
  padding-right: 1em !important;
  padding-left: 1em !important;
}

/* Make sure inner wrap takes full width */
.page__inner-wrap {
  width: 100% !important;
  margin: 0 auto !important;
  padding: 1em 0 !important;
}

.page__content {
  width: 100% !important;
  padding: 0 !important;
}

/* Timeline container */
.timeline {
  position: relative;
  width: 90%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 0;
}

/* The vertical line */
.timeline::after {
  content: '';
  position: absolute;
  width: 6px;
  background-color: #3498db;
  top: 0;
  bottom: 0;
  left: 50%;
  margin-left: -3px;
}

/* Container for timeline items */
.container {
  padding: 10px 40px;
  position: relative;
  background-color: inherit;
  width: 50%;
  box-sizing: border-box;
}

/* Timeline circles */
.container::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 25px;
  background-color: white;
  border: 4px solid #3498db;
  top: 20px;
  border-radius: 50%;
  z-index: 1;
}

/* Left containers positioning */
.left {
  left: 0;
}

/* Right containers positioning */
.right {
  left: 50%;
}

/* Arrows for left containers */
.left::before {
  content: " ";
  height: 0;
  position: absolute;
  top: 22px;
  width: 0;
  z-index: 1;
  right: 30px;
  border: medium solid #f2f2f2;
  border-width: 10px 0 10px 10px;
  border-color: transparent transparent transparent #f2f2f2;
}

/* Arrows for right containers */
.right::before {
  content: " ";
  height: 0;
  position: absolute;
  top: 22px;
  width: 0;
  z-index: 1;
  left: 30px;
  border: medium solid #f2f2f2;
  border-width: 10px 10px 10px 0;
  border-color: transparent #f2f2f2 transparent transparent;
}

/* Circle position for right containers */
.right::after {
  left: -16px;
}

/* Circle position for left containers */
.left::after {
  right: -16px;
}

/* Content styling */
.content {
  padding: 20px 30px;
  background-color: #f2f2f2;
  position: relative;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  width: 100%;
}

/* Hover effect */
.content:hover {
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
}

/* Headings */
.content h2 {
  margin-top: 0;
  color: #3498db;
}

/* Date styling */
.date {
  color: #6c757d;
  font-style: italic;
}

/* Mobile responsiveness */
@media screen and (max-width: 992px) {
  .page {
    width: 100% !important;
    padding: 0 1em !important;
  }
}

@media screen and (max-width: 768px) {
  /* The vertical line moves to left side */
  .timeline::after {
    left: 31px;
  }
  
  /* All containers are full width */
  .container {
    width: 100%;
    padding-left: 70px;
    padding-right: 25px;
  }
  
  /* Arrows all point right */
  .container::before {
    left: 60px;
    border: medium solid #f2f2f2;
    border-width: 10px 10px 10px 0;
    border-color: transparent #f2f2f2 transparent transparent;
  }

  /* Circles align left */
  .left::after, .right::after {
    left: 15px;
  }
  
  /* Right containers behave like left */
  .right {
    left: 0%;
  }
}
</style>

<div class="timeline">
  <div class="container left">
    <div class="content">
      <h2>Doctoral Research</h2>
      <p class="date">2022 - Present</p>
      <p>Working on novel approaches to machine learning models for computer vision applications. Focus on developing efficient deep learning architectures for real-time object detection in resource-constrained environments.</p>
      <p>Key achievements:</p>
      <ul>
        <li>Developed a lightweight CNN architecture that achieves 95% accuracy while using 40% fewer parameters</li>
        <li>Published findings in top-tier conferences including CVPR and ICCV</li>
        <li>Collaborated with industry partners to implement solutions in embedded systems</li>
      </ul>
    </div>
  </div>
  <div class="container right">
    <div class="content">
      <h2>Master's Thesis Research</h2>
      <p class="date">2020 - 2022</p>
      <p>Investigated transfer learning techniques for medical image analysis. Focused on applying deep learning to improve diagnostic accuracy in radiological images.</p>
      <p>Key outcomes:</p>
      <ul>
        <li>Designed a novel transfer learning approach that improved classification accuracy by 17%</li>
        <li>Implemented a prototype system that was tested in collaboration with University Hospital</li>
        <li>Research led to two journal publications in IEEE Transactions on Medical Imaging</li>
      </ul>
    </div>
  </div>
  <div class="container left">
    <div class="content">
      <h2>Research Internship at Tech Corp</h2>
      <p class="date">Summer 2019</p>
      <p>Worked with the R&D team on developing computer vision algorithms for autonomous navigation systems. Focused on real-time obstacle detection and avoidance.</p>
      <p>Contributions:</p>
      <ul>
        <li>Implemented and optimized SLAM algorithms for indoor navigation</li>
        <li>Developed a simulation environment for testing navigation algorithms</li>
        <li>Work resulted in a patent application for a novel sensor fusion approach</li>
      </ul>
    </div>
  </div>
  <div class="container right">
    <div class="content">
      <h2>First paper: Quantum PUF</h2>
      <p class="date">Fall 2020-Spring 2021</p>
      <p>Wrote my first PhD paper on fingerprinting quantum hardware</p>
      <p>Accomplishments:</p>
      <ul>
        <li>Ran experiments on real quantum hardware</li>
        <li>Distinguishable results for both strong and weak PUFs</li>
        <li>Superposition and Decoherence-based PUFs</li>
      </ul>
    </div>
  </div>
  <div class="container left">
    <div class="content">
      <h2>PhD started</h2>
      <p class="date">Fall 2020</p>
      <p>Started research in Quantum Computing</p>
    </div>
  </div>
</div>