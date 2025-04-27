const getCurrentUserFollowingStatus = (user, currentUser) => {
  // Check if the currentUser is following the user
  if (currentUser.following.includes(user._id)) {
    return "following";
  }

  // Check if the currentUser has sent a follow request to the user
  if (user.followingRequests.includes(currentUser._id)) {
    return "Request Sent";
  }

  // Default to 'follow' if neither condition is met
  return "follow";
};
export default getCurrentUserFollowingStatus;
