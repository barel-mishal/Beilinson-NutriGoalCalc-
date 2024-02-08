import { Show, createMemo, createSignal } from 'solid-js'
import { calcBMI, calcCasesFixOverWeight } from './util/nutriFuncs'
import { formatNumber } from './util/util';


function App() {
  const [, setName] = createSignal('');
  const [age, setAge] = createSignal('');
  const [weight, setWeight] = createSignal('');
  const [height, setHeight] = createSignal('');
  const [caloriesToKg, setCaloriesToKg] = createSignal('');
  const [proteinToKg, setProteinToKg] = createSignal('');
  const [fixOverWeight, setFixOverWeight] = createSignal('');

  const numbersArgs = () => ({
    age: Number(age()) || 0,
    weight: Number(weight()) || 0,
    height: Number(height()) || 0,
    caloriesToKg: Number(caloriesToKg()) || 0,
    proteinToKg: Number(proteinToKg()) || 0,
    fixOverWeight: Number(fixOverWeight()) || 0,
  });

  const compute = createMemo(() => {
    const { age, weight, height, caloriesToKg, proteinToKg, fixOverWeight } = numbersArgs();
    const BMI = calcBMI(weight, height);
    const fixedBodyWeight = calcCasesFixOverWeight(BMI, age, fixOverWeight, height, weight);
    return {
      bmi: formatNumber(BMI),
      dri: {
        calories: formatNumber(caloriesToKg * weight),
        protein: formatNumber(proteinToKg * weight),
      },
      fixedBodyWeight: fixedBodyWeight.bodyWeight.fixWeight === 0 ? "" : formatNumber(fixedBodyWeight.bodyWeight.fixWeight),
      fixTo: formatNumber(fixedBodyWeight.fixTo)
    };
  });
  const allFilled = () => {
    const { age, weight, height, caloriesToKg, proteinToKg, fixOverWeight } = numbersArgs();
    return age && weight && height && caloriesToKg && proteinToKg && fixOverWeight ? true : false;
  }
  const textWhenNotAllFilled = () => {
    return allFilled() ? "נקה" : "דוגמא"
  }
  const [showModel, setShowModel] = createSignal(false);
  const toggleModel = () => setShowModel(!showModel());

  return (
    <div class='grid place-items-center h-screen bg-sky-950 '>
      <div class="mx-auto p-4 bg-sky-50 rounded-lg max-w-lg shadow-xl shadow-sky-900">
        <div class='flex justify-between'>
          <div class='flex gap-2'>
            <h1 class="text-3xl font-bold mb-4 text-blue-900">מחשבון תזונתי</h1>
            <button class='bg-green-950 rounded-full w-6 h-6 text-green-50' onClick={toggleModel}>!</button>
          </div>
          <div>
              <button class='btn' onClick={() => {
                if (allFilled()) {
                  setName('')
                  setAge('')
                  setWeight('')
                  setHeight('')
                  setCaloriesToKg('')
                  setProteinToKg('')
                  setFixOverWeight('')
                  return 
                }
                setName('אלמוני')
                setAge('30')
                setWeight('80')
                setHeight('180')
                setCaloriesToKg('30')
                setProteinToKg('1.5')
                setFixOverWeight('25')
              }}>{textWhenNotAllFilled()}</button>
          </div>
        </div>
        <div class="flex flex-col space-y-4 [text-wrap:balance]">
          <div>
            <span class='font-bold'>גיל: </span> <input type="text"  value={age()} class="inline-block w-20 border-b-2 font-bold border-sky-500 border-dotted text-center rounded-md" onInput={(e) => setAge(e.currentTarget.value)} /> שנים, 
            <span class='font-bold'>גובה: </span> <input type="text" value={height()} class="inline-block w-20 border-b-2 font-bold border-sky-500 border-dotted text-center rounded-md" onInput={(e) => setHeight(e.currentTarget.value)} /> ס"מ, 
            <span class='font-bold'>משקל: </span> <input type="text" value={weight()} class="inline-block w-20 border-b-2 font-bold border-sky-500 border-dotted text-center rounded-md" onInput={(e) => setWeight(e.currentTarget.value)} /> ק"ג, 
            <span class='font-bold'>BMI: </span> <span class="inline-block w-14 border-b-2 border-dotted text-center font-bold" >
              {compute().bmi}
              </span> ק"ג/מ"ר 
              <Show when={compute().fixedBodyWeight}>
                (בהשמנה, תקנון משקל ל-<input type="text" onInput={e => setFixOverWeight(e.currentTarget.value)} value={compute().fixTo} class="inline-block w-16 border-b-2 border-dotted border-sky-500 text-center font-bold" /> מומלץ)
              </Show>
          </div>
          <div>
            <p>
              יעדים תזונתיים <Show when={compute().fixedBodyWeight}>(לפי משקל מתוקנן <span class="inline-block font-bold w-16 border-b-2 border-dotted text-center" >{compute().fixedBodyWeight}</span>)</Show>:
            </p>
            <p>
              אנרגיה: לפי <input 
              type="text" value={caloriesToKg() === "0" ? "" : caloriesToKg()} 
              onInput={(e) => setCaloriesToKg(e.currentTarget.value)}
              class="rounded-md inline-block w-16 border-b-2 border-dotted text-center border-sky-500 font-bold" /> קק"ל/ק"ג, <span class="inline-block w-24 border-b-2 border-dotted text-center font-bold" >{compute().dri.calories === "0" ? "" : compute().dri.calories}</span> קק"ל,
            </p>
            <p>
              חלבון: לפי <input 
              type="text"
              onInput={(e) => setProteinToKg(e.currentTarget.value)}
               value={proteinToKg() === "0" ? "" : proteinToKg()} class=" rounded-md inline-block w-16 border-b-2 border-dotted text-center border-sky-500 font-bold" /> גרם/ק"ג, <span class="inline-block w-20 border-b-2 border-dotted text-center font-bold" >{compute().dri.protein === "0" ? "" : compute().dri.protein}</span> גרם.
            </p>
          </div>
        </div>
      </div>
      <Show when={showModel()}>
        <div class='bg-sky-300/25 absolute h-screen w-screen backdrop-blur-sm grid place-items-center'>
          <div class='w-[350px] bg-sky-50 rounded-lg p-6 min-h-72'>
            <button class='text-sky-600 font-extrabold ' onclick={toggleModel}>X</button>
            <section class='grid gap-2'>
              <h2 class='font-bold text-sky-800'>הוראות שימוש</h2>
              <p>מילוי שדות לפי היחידות המתאימות</p>
              <p>קבלת אנרגיה, חלבון ו-BMI או BMI מתוקנן.</p>
              <p>אפשר לראות דוגמה ע"י לחיצה על דוגמה</p>
              <h2 class='font-bold text-sky-800'>החישוב מבוסס לפי:</h2>
              <h3>תקנון משקל:</h3>
              <ul>
                  <li>עד גיל 64: BMI 25 - 18.5, תיקנון ל- BMI 25</li>
                  <li>גילאי 65-74: BMI 28 - 22, תיקנון ל- BMI 28</li>
                  <li>75 ומעלה: BMI 30 - 23, תיקנון ל- BMI 30</li>
                  <li>תת משקל לא לתקנן</li>
              </ul>
              <h2>חישוב צרכים תזונתיים</h2>
              <p>תיעוד במעקב התזונתי ובסרגל מדדים</p>
              <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead>
                        <tr>
                            <th class="whitespace-nowrap p-2 text-xs">קטגוריה</th>
                            <th class="whitespace-nowrap p-2 text-xs md:text-sm">קלוריות (קק"ל לק"ג)</th>
                            <th class="whitespace-nowrap p-2 text-xs md:text-sm">חלבון (גרם לק"ג)</th>
                            <th class="whitespace-nowrap p-2 text-xs md:text-sm">נוזלים (מ"ל לק"ג)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="p-1 text-xs">צעירים</td>
                            <td class="p-1 text-xs">35 - 30</td>
                            <td class="p-1 text-xs">2.0 - 1.0</td>
                            <td class="p-1 text-xs">30 מ"ל לק"ג</td>
                        </tr>
                        <tr>
                            <td class="p-1 text-xs">קשישים</td>
                            <td class="p-1 text-xs">28 - 26</td>
                            <td class="p-1 text-xs">2.0 - 1.0</td>
                            <td class="p-1 text-xs">30 מ"ל לק"ג</td>
                        </tr>
                        <tr>
                            <td class="p-1 text-xs">מונשמים</td>
                            <td class="p-1 text-xs">25</td>
                            <td class="p-1 text-xs">2.0 - 1.0</td>
                            <td class="p-1 text-xs">30 מ"ל לק"ג</td>
                        </tr>
                        <tr>
                            <td class="p-1 text-xs">פצעי לחץ</td>
                            <td class="p-1 text-xs">לפי פרמטרים נ"ל</td>
                            <td class="p-1 text-xs">↑ - 1.5</td>
                            <td class="p-1 text-xs">30 מ"ל לק"ג</td>
                        </tr>
                    </tbody>
                </table>
              </div>
              <p>במקרה שמתקננים משקל, חישוב קלוריות לפי משקל מתוקנן.</p>
              <p>חישוב לנוזלים ללא איבודים נוספים.</p>
            </section>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default App;




