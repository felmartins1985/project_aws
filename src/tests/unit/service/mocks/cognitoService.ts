import { AxiosRequestHeaders } from "axios";

export const mockUserEmail = {
  "id": "44f844f8-4071-70a2-6cfc-04e27c77b10d",
  "name": "Joao",
  "email": "joao@email.com",
  "role": "[{\"role\":\"admin\",\"org\":\"bigtrade\"}]"
}
export const mockInvalidToken ="eyJraWQiOiJYTnl4eUVObEsrSlZrbkZCK2w1UENFd2Y0NEUwQ0VweWp6T05IOVRlT1JnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0NGY4NDRmOC00MDcxLTcwYTItNmNmYy0wNGUyN2M3N2IxMGQiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9QcmFlQ1BFT20iLCJjbGllbnRfaWQiOiIxdnFodTcyYm9nbGRsZ3NzN3NoczZvb3VkcCIsIm9yaWdpbl9qdGkiOiIyNzg1YWZkMy1hNjJjLTQ4NWYtOWNiYS02YmI2YzMzOGY0MWIiLCJldmVudF9pZCI6ImRlMTY4YjlmLTc2OTMtNGQ2Yi1iYTRkLTI4ZTE5OTczYmRkMSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MjI5NTk4MDUsImV4cCI6MTcyMjk2MzQwNSwiaWF0IjoxNzIyOTU5ODA1LCJqdGkiOiJlNzA3ODE0OC03MTEwLTQxNzctYmViOC03M2U1NjBiY2U0NDkiLCJ1c2VybmFtZSI6ImpvYW9AZW1haWwuY29tIn0.PJrgJ4xVslPpbqbsEG8PdNZRcYJz08Qu7nGTVkupVlVGrIALdC6MutDqjFFAkegrxE0WQM8CUi0Kq7yBCibbSugNXZneA_IfkJ-9oKFd53WvdTIxVn5TeL4g8GP0zcvKYJ_4ekUFdgIU5pGhMvSzD1sjxEvRjEdwHQwRVxSFntNePFsUES4yt5U0DDJsyoV10khsCzM9JTs-89ZKJ2BGb0rbL0HAY15x7ajtapVL20iVE1vC1_d8gkPV6VwtX9xZPuqRtXm7oEwPdHSmsLSPUfeVGMriCx9GqGwDNHEtAUkw-0Med0XzHg0cQYnhFyCxyk8yn16rnd3jxnuJVzt2Rw"

/// sempre atualizar o auth_time e exp
export const mockResponseExecuteValidationRoutine = {
  "data": {
    "auth_time": 1724064799,
    "data": {
      "email": "joao@email.com",
      "id": "1468a478-80c1-70ad-aad1-310927eab406",
      "name": "Joao",
      "role": "[{\"role\":\"admin\",\"org\":\"bigtrade\"}]"
    },
    "exp": 1724093599,
    "status": true
  },
  "status": true
}

export const mockResponseValidateToken ={
  "keys": [
    {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'TXOTxWtngZDnYw1ugntidEVvYgrzoHpoh1Vd/kg49xY=',
      kty: 'RSA',
      n: '62T9TeDBQq9ZYWf3kagVpPu3q9LfXAEblh5RyIaFKCEWrHx9AkIWNEWJeYFFuPKFA3vCMM0y3WZEMsyGO3-uMPjeSXbLH7kzVi7nMqUkXo5WcAT3_bnuOSjDr2fAe0AJ3Xh3Wvh_UcQy-frUPHgl-kBIFmEWAxwUUqNqmD6FZqt-r2QWXKUkRIEjHpdZ6ymegif0pQGC6sDJqBpG9ndj4x-Ijlb8GwJ3XQmenPgnmM-9YHOTtAYYXT3Ur0-8kKkHpT1sirEqoR_RK_LWExw2S4oGAuHEtj1Hw4T71_2ABv9hFTanXLI3GZInVS0TUqLsQfz6TbGv1_w4DKAWdUXkpw',
      use: 'sig'
    },
    {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'XNyxyENlK+JVknFB+l5PCEwf44E0CEpyjzONH9TeORg=',
      kty: 'RSA',
      n: 'lNEmVQfSnG1U5ndxABNdR4FvRFEG9A_DOScRMTPjD5trDaFlgJ_C5JDA2VCUIfmwqCpOIUeWPim9cnTfQcBxyt5HN7cgbJ81FDy3wSm5JQKm_A_zE6PYooBd5DT_ASx5zyOqFROEZTuBQmi2z3iCFOrmTnPepTz8-a8OV3ZbXKDrdka9ck3LvEDtr1etRAoh5p814YARuRgV1vE2dsWvV_GOZYhyf6wsaKRropfx63QM33F-GhWpogwwvkn26hvtdlkw2tAaL0fQCqMMMJVjUAgeyHma1UFOoX6nB9RNrVbHFkm3y-kDWpvTG1iYA0oG6lJ4ui1GiA7MQwVigsVxJw',
      use: 'sig'
    }
  ]
}

export const mockResponse = {
  status: 200,
  data: mockResponseValidateToken,
  statusText: 'OK',
  headers: { 'Content-Type': 'application/json' },
  config: {
    url: '',
    method: 'get',
    headers: { 'Content-Type': 'application/json' } as AxiosRequestHeaders,
  },
};
