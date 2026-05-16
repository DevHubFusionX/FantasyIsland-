import { useEffect } from 'react'

const TawkChat = () => {
  useEffect(() => {
    const s1 = document.createElement('script')
    const s0 = document.getElementsByTagName('script')[0]
    s1.async = true
    s1.src = 'https://embed.tawk.to/6a07ff63bd58711c2c68b59f/1jonjr83o'
    s1.charset = 'UTF-8'
    s1.setAttribute('crossorigin', '*')
    s0.parentNode.insertBefore(s1, s0)
  }, [])

  return null
}

export default TawkChat
