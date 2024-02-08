type ReturnCalcCasesFixOverWeight = {
    bodyWeight: {
        fixWeight: number;
        idealBodyWeight: number;
    };
    fixTo: number;
}

export const calcCasesFixOverWeight = (bmi: number, age: number, fixTo: number, height: number, weight: number): ReturnCalcCasesFixOverWeight => {
    let result = {
        bodyWeight: {
            fixWeight: 0,
            idealBodyWeight: 0
        },
        fixTo
      }
    
    if (bmi > 25 && age < 65 && age >= 18) {
      const cfixTo = fixTo === 0 ? 25 : fixTo
      result = {
            bodyWeight: calcFixOverWeight(cfixTo, height, weight), 
            fixTo: cfixTo
        } 
    } else if (bmi > 25 && (age >= 65 && 75 < age)) {
      const cfixTo = fixTo === 0 ? 28 : fixTo
      result = {
        bodyWeight: calcFixOverWeight(cfixTo, height, weight), 
        fixTo: cfixTo
      }
    } else if (bmi > 25 && age >= 75) {
      const cfixTo = fixTo === 0 ? 30 : fixTo
      result = {
        bodyWeight: calcFixOverWeight(cfixTo, height, weight), 
        fixTo: cfixTo
      }
    }  
    return result
  }
  
export const calcFixOverWeight = (fixTo: number, height: number, weight: number) => {
    const idealBodyWeight = fixTo * (height/100)**2
    return {
      fixWeight: (weight - idealBodyWeight) * 0.25 + idealBodyWeight,
      idealBodyWeight
    }
}

export const calcBMI = (weight: number, height: number) => {
    return weight / ((height === 0 ? 1 : height) / 100) ** 2
}