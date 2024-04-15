export function hackSquarespaceMenu() {
  const authToken = localStorage.getItem('authToken')

  let userIsLoggedIn = false
  if(authToken && !isTokenExpired(authToken))
    userIsLoggedIn = true
  
  console.log('userIsLoggedIn', userIsLoggedIn)

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
          // Add one more element to the top menu that contains other two links inside
          const shopLinkContainer = document.createElement('span')
          shopLinkContainer.className = 'Header-nav-item Header-nav-item--folder'
          const shopLink = document.createElement('a')
          shopLink.className = 'Header-nav-folder-title Header-nav-folder-title--active'
          shopLink.href = '/shop'
          shopLink.innerText = 'Shop +'
          shopLinkContainer.appendChild(shopLink)
          const folder = document.createElement('span')
          folder.className = 'Header-nav-folder'
          const subShopLink1 = document.createElement('a')
          subShopLink1.className = 'Header-nav-folder-item'
          subShopLink1.href = '/shop1'
          subShopLink1.innerText = 'Shop 1'
          folder.appendChild(subShopLink1)
          const subShopLink2 = document.createElement('a')
          subShopLink2.className = 'Header-nav-folder-item'
          subShopLink2.href = '/shop2'
          subShopLink2.innerText = 'Shop 2'
          folder.appendChild(subShopLink2)
          shopLinkContainer.appendChild(folder)
          parentOfAllContainerLinks.appendChild(shopLinkContainer)

          // Add one more element to the top menu that does not contain any links inside
          const candiesLinkContainer = document.createElement('span')
          candiesLinkContainer.className = 'Header-nav-item'
          const candiesLink = document.createElement('a')
          candiesLink.className = 'Header-nav-folder-title Header-nav-folder-title--active'
          candiesLink.href = '/candies'
          candiesLink.innerText = 'Candies'
          candiesLinkContainer.appendChild(candiesLink)
          parentOfAllContainerLinks.appendChild(candiesLinkContainer)
        }
      }
    }
  }
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
