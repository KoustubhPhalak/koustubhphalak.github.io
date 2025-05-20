---
title: "Research Timeline"
permalink: /research-timeline/
author_profile: true
---

<style>
.timeline {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
}

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

.container {
  padding: 10px 40px;
  position: relative;
  background-color: inherit;
  width: 50%;
}

.container::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 25px;
  right: -17px;
  background-color: white;
  border: 4px solid #3498db;
  top: 20px;
  border-radius: 50%;
  z-index: 1;
}

.left {
  left: 0;
}

.right {
  left: 50%;
}

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

.right::after {
  left: -16px;
}

.content {
  padding: 20px 30px;
  background-color: #f2f2f2;
  position: relative;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.content:hover {
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
}

.content h2 {
  margin-top: 0;
  color: #3498db;
}

.date {
  color: #6c757d;
  font-style: italic;
}

@media screen and (max-width: 768px) {
  .timeline::after {
    left: 31px;
  }
  
  .container {
    width: 100%;
    padding-left: 70px;
    padding-right: 25px;
  }
  
  .container::before {
    left: 60px;
    border: medium solid #f2f2f2;
    border-width: 10px 10px 10px 0;
    border-color: transparent #f2f2f2 transparent transparent;
  }

  .left::after, .right::after {
    left: 15px;
  }
  
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
      <h2>Undergraduate Research Project</h2>
      <p class="date">2018 - 2019</p>
      <p>Conducted research on facial recognition systems with a focus on privacy preservation and bias mitigation.</p>
      <p>Accomplishments:</p>
      <ul>
        <li>Developed a privacy-preserving facial recognition framework</li>
        <li>Analyzed bias in existing datasets and proposed methods for more balanced training</li>
        <li>Presented findings at the Undergraduate Research Symposium</li>
      </ul>
    </div>
  </div>
  <div class="container left">
    <div class="content">
      <h2>PhD started</h2>
      <p class="date">Fall 2020</p>
      <p>Started research in Quantum Computing</p>
      <!-- <ul>
        <li>Gained fundamental understanding of image processing techniques</li>
        <li>Implemented classical algorithms such as Canny and Sobel edge detectors</li>
        <li>Developed skills in experiment design and quantitative evaluation</li>
      </ul> -->
    </div>
  </div>
</div>