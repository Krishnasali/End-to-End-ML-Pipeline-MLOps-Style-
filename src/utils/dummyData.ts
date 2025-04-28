// Generate dummy loan data for demonstration
export const dummyLoanData = () => {
  const data = [];
  const homeOwnershipOptions = ['RENT', 'MORTGAGE', 'OWN'];
  const loanPurposeOptions = [
    'DEBT_CONSOLIDATION', 
    'CREDIT_CARD', 
    'HOME_IMPROVEMENT', 
    'MAJOR_PURCHASE', 
    'MEDICAL', 
    'EDUCATION'
  ];
  const hasDefaultOptions = ['yes', 'no'];

  for (let i = 0; i < 1000; i++) {
    const age = Math.floor(Math.random() * 40) + 25; // 25-65
    const income = Math.floor(Math.random() * 150000) + 30000; // 30k-180k
    const loanAmount = Math.floor(Math.random() * 50000) + 5000; // 5k-55k
    const loanTerm = [36, 60, 120][Math.floor(Math.random() * 3)]; // 3, 5, or 10 years
    const creditScore = Math.floor(Math.random() * 350) + 450; // 450-800
    const employmentLength = Math.floor(Math.random() * 15) + 1; // 1-16 years
    const homeOwnership = homeOwnershipOptions[Math.floor(Math.random() * homeOwnershipOptions.length)];
    const loanPurpose = loanPurposeOptions[Math.floor(Math.random() * loanPurposeOptions.length)];
    const debtToIncome = Math.random() * 0.5 + 0.1; // 0.1-0.6
    const hasDefault = hasDefaultOptions[Math.floor(Math.random() * hasDefaultOptions.length)];
    
    // Calculate approval using a simple rule-based approach for demonstration
    let approved = true;
    
    // High risk factors that might lead to rejection
    if (
      creditScore < 600 || 
      debtToIncome > 0.45 || 
      hasDefault === 'yes' ||
      (loanAmount > 40000 && income < 80000) ||
      (age < 30 && loanAmount > 30000 && employmentLength < 5)
    ) {
      approved = Math.random() > 0.7; // 30% chance of approval for high-risk applicants
    } else {
      approved = Math.random() > 0.2; // 80% chance of approval for lower-risk applicants
    }
    
    data.push({
      id: `loan-${i + 1}`,
      age,
      income,
      loan_amount: loanAmount,
      loan_term: loanTerm,
      credit_score: creditScore,
      employment_length: employmentLength,
      home_ownership: homeOwnership,
      loan_purpose: loanPurpose,
      debt_to_income: debtToIncome.toFixed(2),
      has_default: hasDefault,
      approved
    });
  }
  
  return data;
};