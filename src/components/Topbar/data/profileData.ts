export interface ProfileOption {
  label: string
  icon: string
  redirectTo: string
}

export const profileDataGroup1: ProfileOption[] = [
  {
    label: 'Profil',
    icon: 'fi fi-rs-user',
    redirectTo: '/user-profile/overview',
  },
]

export const profileDataGroup2: ProfileOption[] = [
  {
    label: 'Se deconnecter',
    icon: 'fi fi-rr-sign-out-alt',
    redirectTo: '/login',
  },
]
