import React, { useState } from 'react';

const CancellationModal = ({ isOpen, onClose, booking, onConfirmCancel, cancelLoading }) => {
    
    if (!isOpen) return null;

    const calculateRefund = () => {
        if (!booking?.trip?.startDate) return { refundPercentage: 0, refundAmount: 0 };
        
        const tripStartDate = new Date(booking.trip.startDate);
        const today = new Date();
        const daysUntilTrip = Math.ceil((tripStartDate - today) / (1000 * 60 * 60 * 24));
        
        let refundPercentage = 0;
        if (daysUntilTrip >= 15) {
        refundPercentage = 100;
        } else if (daysUntilTrip >= 7) {
        refundPercentage = 50;
        }
        
        const refundAmount = (booking.paymentAmount * refundPercentage) / 100;
        return { refundPercentage, refundAmount };
    };

    const { refundPercentage, refundAmount } = calculateRefund();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
            {/* Header */}
            <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
                Confirm Cancellation
            </h2>
            </div>

            {/* Content */}
            <div className="space-y-4">
            <p className="text-gray-600">
                Are you sure you want to cancel your booking for{' '}
                <span className="font-semibold">{booking?.trip?.name}</span>?
            </p>

            {/* Refund Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Refund Details</h4>
                <div className="space-y-1 text-sm">
                <p>Trip Start: {new Date(booking?.trip?.startDate).toLocaleDateString()}</p>
                <p>Booking Amount: ₹{booking?.paymentAmount}</p>
                <div className="border-t border-gray-200 mt-2 pt-2">
                    {refundPercentage > 0 ? (
                    <div className="text-green-600">
                        <p>Eligible for {refundPercentage}% refund</p>
                        <p className="font-semibold">Refund Amount: ₹{refundAmount}</p>
                    </div>
                    ) : (
                    <p className="text-red-600">
                        No refund available (less than 7 days before trip)
                    </p>
                    )}
                </div>
                </div>
            </div>

            {/* Refund Policy */}
            <div className="text-sm text-gray-600">
                <p className="font-semibold mb-1">Refund Policy:</p>
                <ul className="list-disc pl-5 space-y-1">
                <li>Full refund if cancelled 15 days before the trip</li>
                <li>50% refund if cancelled 7-14 days before the trip</li>
                <li>No refund if cancelled less than 7 days before the trip</li>
                </ul>
            </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex justify-end gap-3">
            <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
                Keep Booking
            </button>
            <button
                disabled={cancelLoading}
                onClick={async () => {
                    await onConfirmCancel(booking._id);
                    onClose();
                }}
                // className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                className={`text-white px-4 py-2 rounded-md transition-colors ${
                    cancelLoading ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                }`}
            >
                {cancelLoading ? 'Cancelling' : 'Cancel Booking'}
            </button>
            </div>
        </div>
        </div>
    );
};

export default CancellationModal;