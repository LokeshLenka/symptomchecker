import { SymptomTemplate } from '../types';

export const symptomCategories = [
  'General',
  'Head & Neck',
  'Respiratory',
  'Cardiovascular',
  'Gastrointestinal',
  'Musculoskeletal',
  'Neurological',
  'Skin',
  'Urinary',
  'Mental Health'
];

export const symptomDatabase: SymptomTemplate[] = [
  // General
  {
    id: 'fever',
    name: 'Fever',
    category: 'General',
    commonLocations: ['Whole body'],
    description: 'Elevated body temperature above normal range'
  },
  {
    id: 'fatigue',
    name: 'Fatigue',
    category: 'General',
    commonLocations: ['Whole body'],
    description: 'Extreme tiredness or lack of energy'
  },
  {
    id: 'chills',
    name: 'Chills',
    category: 'General',
    commonLocations: ['Whole body'],
    description: 'Feeling cold with shivering'
  },
  {
    id: 'sweating',
    name: 'Excessive Sweating',
    category: 'General',
    commonLocations: ['Whole body', 'Palms', 'Forehead'],
    description: 'Abnormal or excessive perspiration'
  },

  // Head & Neck
  {
    id: 'headache',
    name: 'Headache',
    category: 'Head & Neck',
    commonLocations: ['Forehead', 'Temples', 'Back of head', 'Top of head', 'Whole head'],
    description: 'Pain or discomfort in the head or neck area'
  },
  {
    id: 'sore_throat',
    name: 'Sore Throat',
    category: 'Head & Neck',
    commonLocations: ['Throat', 'Tonsils'],
    description: 'Pain or irritation in the throat'
  },
  {
    id: 'neck_pain',
    name: 'Neck Pain',
    category: 'Head & Neck',
    commonLocations: ['Front of neck', 'Back of neck', 'Side of neck'],
    description: 'Pain or stiffness in the neck area'
  },
  {
    id: 'earache',
    name: 'Earache',
    category: 'Head & Neck',
    commonLocations: ['Left ear', 'Right ear', 'Both ears'],
    description: 'Pain or discomfort in the ear'
  },

  // Respiratory
  {
    id: 'cough',
    name: 'Cough',
    category: 'Respiratory',
    commonLocations: ['Chest', 'Throat'],
    description: 'Persistent coughing or throat clearing'
  },
  {
    id: 'shortness_breath',
    name: 'Shortness of Breath',
    category: 'Respiratory',
    commonLocations: ['Chest', 'Lungs'],
    description: 'Difficulty breathing or feeling breathless'
  },
  {
    id: 'chest_congestion',
    name: 'Chest Congestion',
    category: 'Respiratory',
    commonLocations: ['Chest', 'Upper chest', 'Lower chest'],
    description: 'Feeling of fullness or tightness in the chest'
  },
  {
    id: 'wheezing',
    name: 'Wheezing',
    category: 'Respiratory',
    commonLocations: ['Chest', 'Airways'],
    description: 'High-pitched whistling sound when breathing'
  },

  // Cardiovascular
  {
    id: 'chest_pain',
    name: 'Chest Pain',
    category: 'Cardiovascular',
    commonLocations: ['Center of chest', 'Left chest', 'Right chest', 'Upper chest'],
    description: 'Pain or discomfort in the chest area'
  },
  {
    id: 'palpitations',
    name: 'Heart Palpitations',
    category: 'Cardiovascular',
    commonLocations: ['Chest', 'Heart area'],
    description: 'Feeling of rapid, fluttering, or pounding heartbeat'
  },
  {
    id: 'dizziness',
    name: 'Dizziness',
    category: 'Cardiovascular',
    commonLocations: ['Head'],
    description: 'Feeling lightheaded or unsteady'
  },

  // Gastrointestinal
  {
    id: 'nausea',
    name: 'Nausea',
    category: 'Gastrointestinal',
    commonLocations: ['Stomach', 'Upper abdomen'],
    description: 'Feeling of sickness with urge to vomit'
  },
  {
    id: 'vomiting',
    name: 'Vomiting',
    category: 'Gastrointestinal',
    commonLocations: ['Stomach'],
    description: 'Forceful expulsion of stomach contents'
  },
  {
    id: 'abdominal_pain',
    name: 'Abdominal Pain',
    category: 'Gastrointestinal',
    commonLocations: ['Upper abdomen', 'Lower abdomen', 'Left side', 'Right side', 'Center'],
    description: 'Pain or discomfort in the stomach area'
  },
  {
    id: 'diarrhea',
    name: 'Diarrhea',
    category: 'Gastrointestinal',
    commonLocations: ['Intestines', 'Lower abdomen'],
    description: 'Loose or watery bowel movements'
  },
  {
    id: 'constipation',
    name: 'Constipation',
    category: 'Gastrointestinal',
    commonLocations: ['Lower abdomen', 'Intestines'],
    description: 'Difficulty or infrequent bowel movements'
  },

  // Musculoskeletal
  {
    id: 'back_pain',
    name: 'Back Pain',
    category: 'Musculoskeletal',
    commonLocations: ['Lower back', 'Upper back', 'Middle back', 'Spine'],
    description: 'Pain or discomfort in the back area'
  },
  {
    id: 'joint_pain',
    name: 'Joint Pain',
    category: 'Musculoskeletal',
    commonLocations: ['Knees', 'Shoulders', 'Hips', 'Ankles', 'Wrists', 'Elbows'],
    description: 'Pain or stiffness in joints'
  },
  {
    id: 'muscle_pain',
    name: 'Muscle Pain',
    category: 'Musculoskeletal',
    commonLocations: ['Arms', 'Legs', 'Back', 'Shoulders', 'Neck'],
    description: 'Pain or soreness in muscles'
  },

  // Neurological
  {
    id: 'confusion',
    name: 'Confusion',
    category: 'Neurological',
    commonLocations: ['Head', 'Brain'],
    description: 'Difficulty thinking clearly or concentrating'
  },
  {
    id: 'numbness',
    name: 'Numbness',
    category: 'Neurological',
    commonLocations: ['Arms', 'Legs', 'Hands', 'Feet', 'Face'],
    description: 'Loss of sensation or feeling'
  },
  {
    id: 'tingling',
    name: 'Tingling',
    category: 'Neurological',
    commonLocations: ['Arms', 'Legs', 'Hands', 'Feet'],
    description: 'Pins and needles sensation'
  },

  // Skin
  {
    id: 'rash',
    name: 'Rash',
    category: 'Skin',
    commonLocations: ['Arms', 'Legs', 'Torso', 'Face', 'Hands'],
    description: 'Red, irritated, or inflamed skin'
  },
  {
    id: 'itching',
    name: 'Itching',
    category: 'Skin',
    commonLocations: ['Arms', 'Legs', 'Torso', 'Face', 'Scalp'],
    description: 'Persistent urge to scratch'
  },

  // Urinary
  {
    id: 'frequent_urination',
    name: 'Frequent Urination',
    category: 'Urinary',
    commonLocations: ['Bladder', 'Lower abdomen'],
    description: 'Need to urinate more often than usual'
  },
  {
    id: 'painful_urination',
    name: 'Painful Urination',
    category: 'Urinary',
    commonLocations: ['Bladder', 'Urethra'],
    description: 'Pain or burning sensation when urinating'
  },

  // Mental Health
  {
    id: 'anxiety',
    name: 'Anxiety',
    category: 'Mental Health',
    commonLocations: ['Whole body', 'Chest', 'Head'],
    description: 'Feelings of worry, nervousness, or unease'
  },
  {
    id: 'depression',
    name: 'Depression',
    category: 'Mental Health',
    commonLocations: ['Whole body'],
    description: 'Persistent feelings of sadness or loss of interest'
  }
];