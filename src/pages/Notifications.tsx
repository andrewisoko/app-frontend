import { notificationsService, NotificationUser } from "@/services/notifications";
import { useState,useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import PageTransition from "@/components/animations/PageTransition";



export function Notifications(){

    const [notifications, setNotifications] = useState<NotificationUser[]>([]);
    const [selectedNotification, setSelectedNotification] = useState<NotificationUser | null>(null);
    const [isLoading, setIsLoading] = useState(true)
    const { userProfile } = useAuth()

    

    useEffect(()=>{
        if( !userProfile ) return 

        const fetchNotifications = async () => {
             setIsLoading(true)

            try {
                const notificactionData = await notificationsService.getUserNotifications(userProfile.id)
                setNotifications(notificactionData)

            } catch (error) {
              console.log('Notifications not able to be fetched', error)  
            }
            finally{
                 setIsLoading(false)
            }

        }
        fetchNotifications()
    },[ userProfile])
    

    const handleNotificationClick = async (item: NotificationUser) => {

    setSelectedNotification(item);

    if (!item.read) {
        try {

            await notificationsService.getNotification(item.id);

            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === item.id
                        ? { ...notification, read: true }
                        : notification
                )
            );

                } catch (error) {
                    console.error(error);
                }
            }
        };

  return (

<PageTransition>
    
<div className="min-h-screen bg-[#24134d] p-6">
    <h1 className="text-3xl font-bold text-white mb-6">
        Notifications
    </h1>
    {isLoading ? (

        <div className="text-white">
            Loading...
        </div>
    ) : notifications.length === 0 ? (

        <div className="text-gray-300">
            No notifications
        </div>
    ) : (
        <div className="space-y-3">
            {notifications.map(notification => (
        <button
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={`
                w-full
                rounded-xl
                p-4
                text-left
                transition

                ${
                    notification.read
                    ? "bg-[#32205f]"
                    : "bg-[#5a34c8]"
                }

                hover:scale-[1.01]
            `}
            >
            <div className="flex justify-between">
                <div>
                    <p className="font-semibold text-white">

                    {notification.from}

                </p>
                <p
                    className={`
                        mt-1

                        ${
                            notification.read
                            ? "text-gray-300"
                            : "text-white font-semibold"
                        }
                    `}
                >

                    {notification.message.length > 70
                        ? notification.message.slice(0,70)+"..."
                        : notification.message}
                </p>
            </div>
            {!notification.read && (

                <div
                    className="h-3 w-3 rounded-full bg-violet-300"
                />

            )}
        </div>
    </button>
    ))}
</div>
)}
{
selectedNotification && (
<div className="fixed inset-0 bg-black/60 flex justify-center items-center">
    <div className="bg-[#32205f] rounded-xl p-6 w-[500px]">
        <div className="flex justify-between">
            <h2 className="text-white text-2xl font-bold">
                Notification
            </h2>
            <button
                onClick={() => setSelectedNotification(null)}
                className="text-white"
            >
                ✕
            </button>
        </div>
        <div className="mt-6 space-y-5">
            <div>
                <p className="text-gray-400">
                    From
                </p>
                <p className="text-white">
                    {selectedNotification.from}
                </p>
            </div>
            <div>
                <p className="text-gray-400">
                    Date
                </p>
                <p className="text-white">

                    {new Date(selectedNotification.created_at)
                    .toLocaleString()}
                </p>
            </div>
            <div>
                <p className="text-gray-400">
                    Message
                </p>
                <p className="text-white whitespace-pre-wrap">

                    {selectedNotification.message}

                     </p>
                </div>
            </div>
        </div>
    </div>

    )}
</div>
</PageTransition>

    )

}