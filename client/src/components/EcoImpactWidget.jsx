import React, { useState, useEffect } from 'react';
import { Leaf, Droplets, Heart, TreePine } from 'lucide-react';

const EcoImpactWidget = ({ completedSwaps = 0, userPoints = 0 }) => {
  const [animatedValues, setAnimatedValues] = useState({
    co2Saved: 0,
    waterSaved: 0,
    itemsSwapped: 0
  });

  // Calculate environmental impact
  const co2Saved = Math.round(completedSwaps * 2.5 * 10) / 10; // kg CO2 saved
  const waterSaved = Math.round(completedSwaps * 400); // liters water saved
  const treesEquivalent = Math.round(co2Saved / 22 * 10) / 10; // approximation

  // Animate numbers on mount
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        co2Saved: Math.round(co2Saved * easeOut * 10) / 10,
        waterSaved: Math.round(waterSaved * easeOut),
        itemsSwapped: Math.round(completedSwaps * easeOut)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [completedSwaps, co2Saved, waterSaved]);

  const impactStats = [
    {
      icon: <Leaf className="w-6 h-6 text-green-500" />,
      label: "CO₂ Saved",
      value: animatedValues.co2Saved,
      unit: "kg",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-800"
    },
    {
      icon: <Droplets className="w-6 h-6 text-blue-500" />,
      label: "Water Conserved",
      value: animatedValues.waterSaved,
      unit: "liters",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-800"
    },
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      label: "Items Swapped",
      value: animatedValues.itemsSwapped,
      unit: "items",
      color: "bg-red-50 border-red-200",
      textColor: "text-red-800"
    },
    {
      icon: <TreePine className="w-6 h-6 text-emerald-500" />,
      label: "Trees Equivalent",
      value: treesEquivalent,
      unit: "trees",
      color: "bg-emerald-50 border-emerald-200",
      textColor: "text-emerald-800"
    }
  ];

  const getImpactMessage = () => {
    if (completedSwaps === 0) {
      return "Start swapping to see your environmental impact!";
    } else if (completedSwaps < 5) {
      return "Great start! Every swap makes a difference.";
    } else if (completedSwaps < 20) {
      return "Awesome! You're making a real impact.";
    } else {
      return "Incredible! You're an eco-warrior!";
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Leaf className="w-6 h-6 text-green-600" />
          Your Eco Impact
        </h3>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live Impact
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {impactStats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} rounded-lg p-4 border-2 transition-all duration-300 hover:shadow-md hover:scale-105`}
          >
            <div className="flex items-center justify-center mb-2">
              {stat.icon}
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {stat.unit}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-700 mb-2">{getImpactMessage()}</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min((completedSwaps / 50) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Progress to Eco Champion (50 swaps)
        </p>
      </div>

      {completedSwaps > 0 && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
          <p className="text-sm text-center text-gray-700">
            🌱 <strong>Fun Fact:</strong> You've prevented the equivalent of {treesEquivalent} trees worth of CO₂ from entering the atmosphere!
          </p>
        </div>
      )}
    </div>
  );
};

export default EcoImpactWidget;
