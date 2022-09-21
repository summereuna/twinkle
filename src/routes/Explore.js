const Explore = () => {
    return ( <main>
        {userData.uid && (
          <>
            <div id="body-content">
              <div className="profile__container">
                <div className="profile__title">
                  <div className="profile__title__container">
                    <NavLink to={`/${userData.uid}`}>
                      <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                    </NavLink>
                    <div className="profile__title__user">
                      <h1 className="profile__title__username">
                        {userData.displayName}
                      </h1>
                      <h4 className="profile__title__userId">
                        @
                        {userData.email?.substring(
                          0,
                          userData.email?.indexOf("@")
                        )}
                      </h4>
                    </div>
                  </div>
  
                  
  
                <div className="followList">
                  {state === "following" ? (
                    <FollowingList
                      hover={"hover--bg--deep"}
                      userData={userData}
                    />
                  ) : (
                    <FollowerList hover={"hover--bg--deep"} userData={userData} />
                  )}
                </div>
              </div>
            </div>
  
            <div className="mobile">
              <SideSection userObj={userObj} />
            </div>
          </>
        
      </main>);
}

export default Explore;
