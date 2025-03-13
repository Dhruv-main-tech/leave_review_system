import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces for different user types
interface StudentData {
  username: string;
  rollNo: string;
  branch: string;
  year: string;
  section: string;
  mentor: string;
  hod: string;
  phone: string;
}

interface FacultyData {
  username: string;
  uname: string;
}

interface AdminData {
  username: string;
  uname: string;
}

interface SecurityData {
  username: string;
  uname: string;
}

// Student data functions
export const saveStudentData = async (data: StudentData) => {
  try {
    await AsyncStorage.setItem('studentData', JSON.stringify(data));
    console.log('[Data] Saved student data:', data);
  } catch (error) {
    console.error('[Data] Error saving student data:', error);
    throw error;
  }
};

export const getStudentData = async (): Promise<StudentData | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('studentData');
    if (jsonValue != null) {
      const data = JSON.parse(jsonValue);
      console.log('[Data] Retrieved student data:', data);
      return data;
    }
    return null;
  } catch (error) {
    console.error('[Data] Error retrieving student data:', error);
    throw error;
  }
};

// Faculty data functions
export const saveFacultyData = async (data: FacultyData) => {
  try {
    await AsyncStorage.setItem('facultyData', JSON.stringify(data));
    console.log('[Data] Saved faculty data:', data);
  } catch (error) {
    console.error('[Data] Error saving faculty data:', error);
    throw error;
  }
};

export const getFacultyData = async (): Promise<FacultyData | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('facultyData');
    if (jsonValue != null) {
      const data = JSON.parse(jsonValue);
      console.log('[Data] Retrieved faculty data:', data);
      return data;
    }
    return null;
  } catch (error) {
    console.error('[Data] Error retrieving faculty data:', error);
    throw error;
  }
};

// Admin data functions
export const saveAdminData = async (data: AdminData) => {
  try {
    await AsyncStorage.setItem('adminData', JSON.stringify(data));
    console.log('[Data] Saved admin data:', data);
  } catch (error) {
    console.error('[Data] Error saving admin data:', error);
    throw error;
  }
};

export const getAdminData = async (): Promise<AdminData | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('adminData');
    if (jsonValue != null) {
      const data = JSON.parse(jsonValue);
      console.log('[Data] Retrieved admin data:', data);
      return data;
    }
    return null;
  } catch (error) {
    console.error('[Data] Error retrieving admin data:', error);
    throw error;
  }
};

// Security data functions
export const saveSecurityData = async (data: SecurityData) => {
  try {
    await AsyncStorage.setItem('securityData', JSON.stringify(data));
    console.log('[Data] Saved security data:', data);
  } catch (error) {
    console.error('[Data] Error saving security data:', error);
    throw error;
  }
};

export const getSecurityData = async (): Promise<SecurityData | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('securityData');
    if (jsonValue != null) {
      const data = JSON.parse(jsonValue);
      console.log('[Data] Retrieved security data:', data);
      return data;
    }
    return null;
  } catch (error) {
    console.error('[Data] Error retrieving security data:', error);
    throw error;
  }
};

// Clear data function for logout
export const clearUserData = async () => {
  try {
    await AsyncStorage.multiRemove([
      'studentData',
      'facultyData',
      'adminData',
      'securityData'
    ]);
    console.log('[Data] Cleared all user data');
  } catch (error) {
    console.error('[Data] Error clearing user data:', error);
    throw error;
  }
}; 