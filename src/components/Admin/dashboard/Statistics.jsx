// src/components/Statistics.js
import React from 'react';


function Statistics({ title, number, link }) {
  return (
    <div className="col-sm-12 col-md-6 col-xl-3">
      <a href={link}>
        <div className="card mb-3 widget-chart">
          <div className="widget-subheading fsize-1 pt-2 opacity-10 text-warning font-weight-bold">
            <h5>{title}</h5>
          </div>
          <span className="widget-numbers">{number}</span>
        </div>
      </a>
    </div>
  );
}

export default Statistics;
