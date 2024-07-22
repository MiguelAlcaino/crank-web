interface MenuUrls {
  registerUrl: string
  workOutStatsUrl: string
  bookingsUrl: string
  purchasesUrl: string
  profileUrl: string
  homeUrl: string
}

const menuLocalStorageKey = 'squarespaceMenuUrls'

export function hackSquarespaceMenu(hackMenu: boolean = false) {
  if (!hackMenu) return

  const authToken = localStorage.getItem('authToken')

  let userIsLoggedIn = false
  if (authToken && !isTokenExpired(authToken)) userIsLoggedIn = true

  let crankMenuUrls: MenuUrls | null = null

  const jsonCrankMenuUrls = localStorage.getItem(menuLocalStorageKey)

  if (jsonCrankMenuUrls) {
    crankMenuUrls = JSON.parse(jsonCrankMenuUrls) as MenuUrls
  }

  if (!crankMenuUrls) {
    crankMenuUrls = {
      registerUrl: '/register',
      workOutStatsUrl: '/workout-stats',
      bookingsUrl: '/bookings',
      purchasesUrl: '/purchases',
      profileUrl: '/profile',
      homeUrl: '/'
    }
  }

  const welcomeLinkInTopMenu = document.querySelector('a[href="/Welcome"]')

  if (welcomeLinkInTopMenu) {
    const containerOfWelcomeLink = welcomeLinkInTopMenu.parentElement

    if (containerOfWelcomeLink) {
      const parentOfAllContainerLinks = containerOfWelcomeLink.parentElement

      if (parentOfAllContainerLinks) {
        /*
        This is the structure of each element in the top menu on the squarespace site on desktop view
        <span class="Header-nav-item Header-nav-item--folder">
          <a href="/Welcome" class="Header-nav-folder-title Header-nav-folder-title--active" data-controller="HeaderNavFolderTouch" data-controllers-bound="HeaderNavFolderTouch">Welcome</a>
          <span class="Header-nav-folder">
            <a href="/the-team" class="Header-nav-folder-item Header-nav-folder-item--active" data-test="template-nav">The Team</a>
            <a href="/sessions" class="Header-nav-folder-item" data-test="template-nav">Sessions</a>
          </span>
        </span>
         */
        /*
        This is the structure of each element in the top menu on the squarespace site on mobile view
        <button class="Mobile-overlay-nav-item Mobile-overlay-nav-item--folder" data-controller-folder-toggle="Welcome">
          <span class="Mobile-overlay-nav-item--folder-label">Welcome</span>
        </button>
         */
        if (parentOfAllContainerLinks.children) {
          const spanMenus = parentOfAllContainerLinks.children

          let myAccountLinkContainer = null

          for (let i = 0; i < spanMenus.length; i++) {
            const x = spanMenus[i].children
            for (let j = 0; j < x.length; j++) {
              if (x[j].innerHTML == 'My Account') {
                myAccountLinkContainer = x[j].parentElement
                break
              }
            }
          }

          // My Account Menu
          if (myAccountLinkContainer) {
            const newMyAccountLinkContainer = document.createElement('span')

            newMyAccountLinkContainer.className = 'Header-nav-item Header-nav-item--folder'

            // create the link element
            const myAccountLink = document.createElement('a')
            myAccountLink.className = 'Header-nav-folder-title Header-nav-folder-title--active'
            myAccountLink.href = crankMenuUrls.profileUrl
            myAccountLink.innerText = 'My Account'
            newMyAccountLinkContainer.appendChild(myAccountLink)

            // create New to CRANK sub menu
            const myAccountSubMenuSpan = document.createElement('span')
            myAccountSubMenuSpan.className = 'Header-nav-folder'

            if (userIsLoggedIn) {
              // create Workout Stats sub menu link
              const subMenuWorkoutStatsLink = document.createElement('a')
              subMenuWorkoutStatsLink.className = 'Header-nav-folder-item'
              subMenuWorkoutStatsLink.href = crankMenuUrls.workOutStatsUrl
              subMenuWorkoutStatsLink.innerText = 'Workout Stats'
              myAccountSubMenuSpan.appendChild(subMenuWorkoutStatsLink)

              // create Bookings sub menu link
              const subMenuBookingsLink = document.createElement('a')
              subMenuBookingsLink.className = 'Header-nav-folder-item'
              subMenuBookingsLink.href = crankMenuUrls.bookingsUrl
              subMenuBookingsLink.innerText = 'Bookings'
              myAccountSubMenuSpan.appendChild(subMenuBookingsLink)

              // create Purchases sub menu link
              const subMenuPurchasesLink = document.createElement('a')
              subMenuPurchasesLink.className = 'Header-nav-folder-item'
              subMenuPurchasesLink.href = crankMenuUrls.purchasesUrl
              subMenuPurchasesLink.innerText = 'Purchases'
              myAccountSubMenuSpan.appendChild(subMenuPurchasesLink)

              // create Profile sub menu link
              const subMenuProfileLink = document.createElement('a')
              subMenuProfileLink.className = 'Header-nav-folder-item'
              subMenuProfileLink.href = crankMenuUrls.profileUrl
              subMenuProfileLink.innerText = 'Profile'
              myAccountSubMenuSpan.appendChild(subMenuProfileLink)
            } else {
              // create New to CRANK sub menu link
              const subMenuNewToCrankLink = document.createElement('a')
              subMenuNewToCrankLink.className = 'Header-nav-folder-item'
              subMenuNewToCrankLink.href = crankMenuUrls.registerUrl
              subMenuNewToCrankLink.innerText = 'New to CRANK'
              myAccountSubMenuSpan.appendChild(subMenuNewToCrankLink)  
            }
            newMyAccountLinkContainer.appendChild(myAccountSubMenuSpan)
            myAccountLinkContainer.replaceWith(newMyAccountLinkContainer)
          }

          // Logout link menu
          if (userIsLoggedIn) {
            const logoutLinkContainer = document.createElement('span')
            logoutLinkContainer.className = 'Header-nav-item Header-nav-item--folder'

            // Create logout link menu
            const logoutLink = document.createElement('a')
            logoutLink.className = 'Header-nav-folder-title Header-nav-folder-title--active'
            logoutLink.href = '#'
            logoutLink.innerText = 'Logout'
            logoutLink.onclick = () => logout(crankMenuUrls?.homeUrl ?? '/')
            logoutLinkContainer.appendChild(logoutLink)
            parentOfAllContainerLinks.appendChild(logoutLinkContainer)
          }
        }
      }
    }
  }

  hackMobileMenu(userIsLoggedIn, crankMenuUrls)
}

function hackMobileMenu(userIsLoggedIn: boolean, crankMenuUrls: MenuUrls) {
  const myAccountDiv = document.querySelectorAll('[data-controller-folder="my-account1"]')[0]

  const mobileClassName = 'Mobile-overlay-folder-item'

  if (myAccountDiv) {
    const myAccountAnchor = myAccountDiv.getElementsByTagName('a')[0]

    if (myAccountAnchor) {
      myAccountAnchor.remove()
    }

    if (userIsLoggedIn) {
      // create Workout Stats sub menu link
      const subMenuWorkoutStatsLink = document.createElement('a')
      subMenuWorkoutStatsLink.className = mobileClassName
      subMenuWorkoutStatsLink.href = crankMenuUrls.workOutStatsUrl
      subMenuWorkoutStatsLink.innerText = 'Workout Stats'
      myAccountDiv.appendChild(subMenuWorkoutStatsLink)

      // create Bookings sub menu link
      const subMenuBookingsLink = document.createElement('a')
      subMenuBookingsLink.className = mobileClassName
      subMenuBookingsLink.href = crankMenuUrls.bookingsUrl
      subMenuBookingsLink.innerText = 'Bookings'
      myAccountDiv.appendChild(subMenuBookingsLink)

      // create Purchases sub menu link
      const subMenuPurchasesLink = document.createElement('a')
      subMenuPurchasesLink.className = mobileClassName
      subMenuPurchasesLink.href = crankMenuUrls.purchasesUrl
      subMenuPurchasesLink.innerText = 'Purchases'
      myAccountDiv.appendChild(subMenuPurchasesLink)

      // create Profile Stats sub menu link
      const subMenuProfileLink = document.createElement('a')
      subMenuProfileLink.className = mobileClassName
      subMenuProfileLink.href = crankMenuUrls.profileUrl
      subMenuProfileLink.innerText = 'Profile'
      myAccountDiv.appendChild(subMenuProfileLink)

      //Logout link
      const logoutLink = document.createElement('a')
      logoutLink.className = mobileClassName
      logoutLink.href = '#'
      logoutLink.innerText = 'Logout'
      logoutLink.onclick = () => logout(crankMenuUrls?.homeUrl ?? '/')
      myAccountDiv.appendChild(logoutLink)
    } else {
      // create New to CRANK sub menu link
      const subMenuNewToCrankLink = document.createElement('a')
      subMenuNewToCrankLink.className = mobileClassName
      subMenuNewToCrankLink.href = crankMenuUrls.registerUrl
      subMenuNewToCrankLink.innerText = 'New to CRANK'
      myAccountDiv.appendChild(subMenuNewToCrankLink)

      // create Profile Stats sub menu link
      const subMenuProfileLink = document.createElement('a')
      subMenuProfileLink.className = mobileClassName
      subMenuProfileLink.href = crankMenuUrls.profileUrl
      subMenuProfileLink.innerText = 'My Profile'
      myAccountDiv.appendChild(subMenuProfileLink)
    }
  }
}

export function setSquarespaceMenuUrls(
  registerUrl: string,
  workOutStatsUrl: string,
  bookingsUrl: string,
  purchasesUrl: string,
  profileUrl: string,
  homeUrl: string
) {
  const menuUrls: MenuUrls = {
    registerUrl,
    workOutStatsUrl,
    bookingsUrl,
    purchasesUrl,
    profileUrl,
    homeUrl
  }

  localStorage.setItem(menuLocalStorageKey, JSON.stringify(menuUrls))
}

function isTokenExpired(token: string) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  const { exp } = JSON.parse(jsonPayload)
  const expired = Date.now() >= exp * 1000
  return expired
}

export function logout(homeUrl: string) {
  localStorage.removeItem('authToken')
  window.location.href = homeUrl
}
