const BuildNotificationParentChannel = (parentId: number | string) => {
    return `notification-${parentId}`;
}

export default BuildNotificationParentChannel;