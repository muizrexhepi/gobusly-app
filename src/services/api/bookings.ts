// import { ApiResponse } from "@/src/types/api";
// import { Booking, BookingDetails, BookingRequest } from "@/src/types/booking";
// import { apiClient } from "./client";

// class BookingService {
//   async createBooking(bookingData: BookingRequest): Promise<Booking> {
//     const response = await apiClient.post<ApiResponse<Booking>>(
//       "/bookings",
//       bookingData
//     );
//     return response.data.data;
//   }

//   async getUserBookings(
//     page = 1,
//     limit = 20
//   ): Promise<{ bookings: Booking[]; total: number }> {
//     const response = await apiClient.get<
//       ApiResponse<{ bookings: Booking[]; total: number }>
//     >("/bookings", {
//       params: { page, limit },
//     });
//     return response.data.data;
//   }

//   async getBookingDetails(bookingId: string): Promise<BookingDetails> {
//     const response = await apiClient.get<ApiResponse<BookingDetails>>(
//       `/bookings/${bookingId}`
//     );
//     return response.data.data;
//   }

//   async cancelBooking(bookingId: string, reason?: string): Promise<void> {
//     await apiClient.post(`/bookings/${bookingId}/cancel`, { reason });
//   }

//   async modifyBooking(bookingId: string, modifications: any): Promise<Booking> {
//     const response = await apiClient.patch<ApiResponse<Booking>>(
//       `/bookings/${bookingId}`,
//       modifications
//     );
//     return response.data.data;
//   }

//   async getBookingByReference(
//     referenceNumber: string,
//     email?: string
//   ): Promise<BookingDetails> {
//     const response = await apiClient.post<ApiResponse<BookingDetails>>(
//       "/bookings/lookup",
//       {
//         referenceNumber,
//         email,
//       }
//     );
//     return response.data.data;
//   }

//   async syncGuestBookings(bookings: any[]): Promise<void> {
//     await apiClient.post("/bookings/sync", { bookings });
//   }

//   async getBookingConfirmation(bookingId: string): Promise<any> {
//     const response = await apiClient.get<ApiResponse<any>>(
//       `/bookings/${bookingId}/confirmation`
//     );
//     return response.data.data;
//   }

//   async checkIn(bookingId: string): Promise<any> {
//     const response = await apiClient.post<ApiResponse<any>>(
//       `/bookings/${bookingId}/checkin`
//     );
//     return response.data.data;
//   }
// }

// export const bookingService = new BookingService();
