---
title: "Research Timeline"
permalink: /research-timeline/
author_profile: true
---

<style>
/* Only reset spacing for timeline-specific elements */
.page__content section {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

/* Restore sidebar positioning - DO NOT modify these elements */
#main, .page, .page__inner-wrap, article.page, .page__content, header.page__header {
  /* No resets here - let the theme handle these */
}

/* The vertical line */
.timeline {
  position: relative;
  width: 100%;
  padding: 0;
  margin: 0;
}

.timeline::after {
  content: '';
  position: absolute;
  width: 6px;
  background-color: #3498db;
  top: 0;
  bottom: 0;
  left: 60px;
  margin-left: -3px;
  z-index: 0;
}

/* Container for each timeline item */
.container {
  position: relative;
  background-color: inherit;
  width: calc(100% - 100px);
  margin-left: 100px;
  margin-bottom: 25px;
  padding: 0;
}

/* The circles on the timeline */
.container::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: -59px;
  background-color: white;
  border: 3px solid #3498db;
  top: 22px;
  border-radius: 50%;
  z-index: 1;
  margin-left: -1px; /* Fine-tune circle position */
}

/* Content styling */
.content {
  padding: 25px 30px;
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
  margin-bottom: 10px;
}

.date {
  color: #6c757d;
  font-style: italic;
  margin-bottom: 20px;
  display: block;
}

.content p {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1em;
  line-height: 1.6;
}

.content ul {
  margin-top: 0;
  margin-bottom: 15px;
  padding-left: 25px;
  font-size: 1em;
  line-height: 1.6;
}

.content li {
  margin-bottom: 8px;
}

/* Alternating colors */
.container:nth-child(odd) .content {
  background-color: #f9f9f9;
}

.container:nth-child(odd) .content::before {
  border-color: transparent #f9f9f9 transparent transparent;
}

/* Add extra space at the bottom of the timeline */
.timeline::after {
  bottom: -20px;
}

/* Responsive layout - only for the timeline elements */
@media screen and (max-width: 768px) {
  .timeline::after {
    left: 30px;
  }
  
  .container {
    margin-left: 70px;
    width: calc(100% - 85px);
  }
  
  .container::before {
    left: -39px;
  }
}

@media screen and (max-width: 480px) {
  .content {
    padding: 20px 25px;
  }
  
  .container {
    margin-left: 60px;
    width: calc(100% - 75px);
  }
  
  .container::before {
    left: -29px;
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