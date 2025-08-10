import { apiGet, apiPost, ApiResponse } from './apiService';
import { UserRole, Permission } from '@/types/api'; // Assuming Permission is also a type

const ROLES_PERMISSIONS_BASE_URL = '/admin/roles-permissions';

export interface Role { // Define Role interface for frontend
  id: number;
  name: UserRole;
  permissions: Permission[];
}

export interface AssignPermissionsRequest {
  permissionNames: string[];
}

export const rolePermissionService = {
  getAllRoles(): Promise<ApiResponse<Role[]>> {
    return apiGet<Role[]>(`${ROLES_PERMISSIONS_BASE_URL}/roles`);
  },

  getAllPermissions(): Promise<ApiResponse<Permission[]>> {
    return apiGet<Permission[]>(`${ROLES_PERMISSIONS_BASE_URL}/permissions`);
  },

  assignPermissionsToRole(roleId: number, permissionNames: string[]): Promise<ApiResponse<Role>> {
    return apiPost<Role>(`${ROLES_PERMISSIONS_BASE_URL}/roles/${roleId}/assign-permissions`, { permissionNames });
  },

  revokePermissionsFromRole(roleId: number, permissionNames: string[]): Promise<ApiResponse<Role>> {
    return apiPost<Role>(`${ROLES_PERMISSIONS_BASE_URL}/roles/${roleId}/revoke-permissions`, { permissionNames });
  },
};
