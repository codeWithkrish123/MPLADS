/**
 * Indian States & Representative Parliamentary Constituencies
 * Used for dynamic state-to-constituency dropdowns across MPLADS Portal forms
 */

export interface StateConstituencyMap {
  state: string;
  constituencies: string[];
}

export const INDIAN_STATES_AND_CONSTITUENCIES: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Anantapur", "Kakinada", "Nellore"],
  "Arunachal Pradesh": ["Arunachal West", "Arunachal East"],
  "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur", "Nagaon"],
  "Bihar": ["Patna Sahib", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia", "Nalanda"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Korba", "Bastar"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad East", "Ahmedabad West", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Haryana": ["Gurugram", "Faridabad", "Ambala", "Karnal", "Rohtak", "Hisar"],
  "Himachal Pradesh": ["Shimla", "Mandi", "Hamirpur", "Kangra"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Giridih", "Hazaribagh"],
  "Karnataka": ["Bangalore South", "Bangalore North", "Bangalore Central", "Mysore", "Mangalore", "Hubli-Dharwad"],
  "Kerala": ["Thiruvananthapuram", "Ernakulam", "Kozhikode", "Thrissur", "Kollam", "Palakkad"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar"],
  "Maharashtra": ["Nagpur", "Mumbai South", "Mumbai North", "Pune", "Thane", "Nashik", "Aurangabad"],
  "Manipur": ["Inner Manipur", "Outer Manipur"],
  "Meghalaya": ["Shillong", "Tura"],
  "Mizoram": ["Mizoram"],
  "Nagaland": ["Nagaland"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Puri", "Berhampur", "Sambalpur", "Rourkela"],
  "Punjab": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Gurdaspur", "Bhatinda"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer"],
  "Sikkim": ["Sikkim"],
  "Tamil Nadu": ["Chennai South", "Chennai North", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Telangana": ["Hyderabad", "Secunderabad", "Malkajgiri", "Karimnagar", "Warangal"],
  "Tripura": ["Tripura West", "Tripura East"],
  "Uttar Pradesh": ["Varanasi", "Lucknow", "Ghaziabad", "Gautam Buddha Nagar", "Agra", "Kanpur", "Gorakhpur", "Prayagraj", "Ayodhya"],
  "Uttarakhand": ["Dehradun (Tehri Garhwal)", "Haridwar", "Almora", "Nainital-Udhamsingh Nagar"],
  "West Bengal": ["Kolkata Uttar", "Kolkata Dakshin", "Howrah", "Darjeeling", "Asansol", "Siliguri"],
  "Delhi (NCT)": ["New Delhi", "Chandni Chowk", "East Delhi", "South Delhi", "North East Delhi", "West Delhi"],
  "Jammu & Kashmir": ["Srinagar", "Jammu", "Anantnag-Rajouri", "Udhampur", "Baramulla"],
  "Ladakh": ["Ladakh"]
};

export const ALL_INDIAN_STATES = Object.keys(INDIAN_STATES_AND_CONSTITUENCIES);
