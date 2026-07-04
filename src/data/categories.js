import allergensIcon from '../assets/icons/allergens.svg'
import ingredientsIcon from '../assets/icons/ingredients.svg'
import nutritionIcon from '../assets/icons/nutrition.svg'
import kosherIcon from '../assets/icons/kosher.svg'
import manufacturerIcon from '../assets/icons/manufacturer.svg'
import storageIcon from '../assets/icons/storage.svg'
import recyclingIcon from '../assets/icons/recycling.svg'
import warningsIcon from '../assets/icons/warnings.svg'

export const categories = [
  { id: 'ingredients', label: 'רכיבים', icon: ingredientsIcon, color: '#43AA49' },
  { id: 'allergens', label: 'אלרגנים', icon: allergensIcon, color: '#DE0405' },
  { id: 'kosher', label: 'כשרות', icon: kosherIcon, color: '#44157A' },
  { id: 'nutrition', label: 'סימון תזונתי ל- 100 גרם', icon: nutritionIcon, color: '#F5851F' },
  { id: 'storage', label: 'הוראות אחסון', icon: storageIcon, color: '#2FB0E9' },
  { id: 'manufacturer', label: 'יצרן/יבואן/משווק/אחסון', icon: manufacturerIcon, color: '#29256A' },
  { id: 'warnings', label: 'אזהרות', icon: warningsIcon, color: '#DE0405' },
  { id: 'recycling', label: 'מיחזור', icon: recyclingIcon, color: '#7E4836' },
]

export const product = {
  name: 'חטיף ווופל עם קרם קרמל מצופה שוקולד חלב מעולה',
  netWeight: "30 גר'",
}
