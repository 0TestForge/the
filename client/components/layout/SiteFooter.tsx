import React from "react";

export function SiteFooter() {
  return (
    <footer className="mt-28 py-12 bg-gradient-to-r from-[#0E2514] to-black">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Logo and Disclaimer */}
          <div className="lg:col-span-4">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/22728fbc02d13cc5a77f75bd91703bd834701b76?width=314"
              alt="RO CART"
              className="w-[157px] h-[37px] mb-6"
            />
            <p className="text-white text-sm font-medium mb-6">
              Disclaimer
            </p>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Social Media */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-4">Social Media</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#999] text-base hover:text-white transition">Twitter</a></li>
                  <li><a href="#" className="text-[#999] text-base hover:text-white transition">Youtube</a></li>
                  <li><a href="#" className="text-[#999] text-base hover:text-white transition">TikTok</a></li>
                  <li><a href="#" className="text-[#999] text-base hover:text-white transition">Discord</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#999] text-base hover:text-white transition">Contact Us</a></li>
                  <li><a href="#faq" className="text-[#999] text-base hover:text-white transition">FAQ</a></li>
                  <li><a href="#" className="text-[#999] text-base hover:text-white transition">Trust Pilot</a></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#999] text-base hover:text-white transition">Blogs</a></li>
                  <li><a href="#" className="text-[#999] text-base hover:text-white transition">Affiliates</a></li>
                  <li><a href="#" className="text-[#999] text-base hover:text-white transition">Claim Order</a></li>
                  <li><a href="#" className="text-[#999] text-base hover:text-white transition">Tutorial</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-4">Legal</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#999] text-base hover:text-white transition">Terms Of Service</a></li>
                  <li><a href="#" className="text-[#999] text-base hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" className="text-[#999] text-base hover:text-white transition">Refund Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Social Icons */}
          <div className="flex gap-3">
            <a href="#" className="w-[72px] h-12 rounded-lg bg-gradient-to-r from-[#06100A]/56 to-[#2C764A]/0 flex items-center justify-center hover:opacity-80 transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.4444 3.6001L9.3924 12.8665L2.4 20.4001H3.9744L10.0968 13.8037L15.0444 20.4001H20.4L13.0596 10.6129L19.5684 3.6001H17.9952L12.3552 9.6745L7.8 3.6001H2.4444ZM4.758 4.7557H7.2192L18.0852 19.2433H15.6252L4.758 4.7557Z" fill="#E5E5F5"/>
              </svg>
            </a>
            <a href="#" className="w-[72px] h-12 rounded-lg bg-gradient-to-r from-[#06100A]/56 to-[#2C764A]/0 flex items-center justify-center hover:opacity-80 transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1_477)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M21.3904 3.86345C22.4184 4.14893 23.2289 4.98501 23.5057 6.04541C24.0197 7.98267 23.9999 12.0203 23.9999 12.0203C23.9999 12.0203 23.9999 16.0375 23.5057 17.9749C23.2289 19.0353 22.4184 19.8713 21.3904 20.1567C19.5123 20.6666 11.9999 20.6666 11.9999 20.6666C11.9999 20.6666 4.5074 20.6666 2.60955 20.1365C1.58155 19.8509 0.771001 19.0149 0.494232 17.9545C-4.76837e-07 16.0375 -4.76837e-07 11.9999 -4.76837e-07 11.9999C-4.76837e-07 11.9999 -4.76837e-07 7.98267 0.494232 6.04541C0.771001 4.98501 1.60131 4.12855 2.60955 3.84305C4.48763 3.33325 11.9999 3.33325 11.9999 3.33325C11.9999 3.33325 19.5123 3.33325 21.3904 3.86345ZM15.8547 11.9997L9.60753 15.7111V8.28832L15.8547 11.9997Z" fill="#E5E5F5"/>
                </g>
                <defs>
                  <clipPath id="clip0_1_477">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </a>
            <a href="#" className="w-[72px] h-12 rounded-lg bg-gradient-to-r from-[#06100A]/56 to-[#2C764A]/0 flex items-center justify-center hover:opacity-80 transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.1672 3.75968C17.2536 2.7199 16.7497 1.38356 16.7499 0H15.6455C15.7882 0.764781 16.0853 1.49252 16.5187 2.1389C16.9521 2.78526 17.5135 3.33672 18.1672 3.75968Z" fill="#E5E5F5"/>
                <path d="M7.71268 11.8076C6.87132 11.8119 6.07438 12.2037 5.41399 12.6846C4.75359 13.1655 4.28632 13.8362 4.08643 14.5901C3.88654 15.3441 3.96547 16.1381 4.3107 16.8458C4.65592 17.5536 5.55201 18.0704 6.29622 18.4325C5.88921 17.9139 5.34114 17.366 5.28768 16.7276C5.23422 16.0892 5.37307 15.4497 5.6889 14.8796C6.00472 14.3094 6.48525 13.831 7.07736 13.497C7.66948 13.163 8.35015 12.9864 9.0442 12.9869C9.42229 12.9906 9.79785 13.0444 10.1593 13.1468V8.92836C9.79012 8.87745 9.41748 8.8509 9.0442 8.84888H8.84145L8.67846 11.8719C8.31669 11.7825 8.08707 11.7982 7.71268 11.8076Z" fill="#E5E5F5"/>
                <path d="M21.2975 5.6228V8.82193C19.2353 8.81744 17.2267 8.16484 15.5565 6.95654V15.3629C15.5523 17.3774 14.7483 19.3079 13.3209 20.731C11.8935 22.1539 9.95926 22.9531 7.94271 22.9531C6.38304 22.9561 4.86087 22.4755 3.58635 21.5774C4.62562 22.6942 5.97747 23.4724 7.46581 23.8108C8.95414 24.149 10.51 24.0317 11.9306 23.4742C13.3513 22.9165 14.5709 21.9445 15.4306 20.6845C16.2904 19.4245 16.7503 17.9351 16.7507 16.4102V8.03008C18.4266 9.23039 20.4378 9.87412 22.5 9.87028V5.75059C22.0958 5.74969 21.6929 5.70688 21.2975 5.6228Z" fill="#E5E5F5"/>
                <path d="M15.5567 15.3651V6.9588C17.2335 8.15999 19.3637 9.0471 21.4271 9.0417L21.3627 5.63277C20.1444 5.37594 18.9899 4.69657 18.1709 3.75968C17.5173 3.33672 16.9566 2.78526 16.5233 2.1389C16.0899 1.49252 15.7928 0.764781 15.65 0H12.6185V16.5571C12.589 17.2778 12.3356 17.9713 11.8934 18.5415C11.4512 19.1117 10.8422 19.53 10.151 19.7385C9.45984 19.947 8.72084 19.9353 8.03666 19.705C7.35248 19.4746 6.7571 19.0371 6.33324 18.4533C5.64762 18.0924 5.10239 17.5131 4.78422 16.8072C4.46604 16.1013 4.39317 15.3095 4.57721 14.5575C4.76124 13.8055 5.19161 13.1365 5.7999 12.6569C6.4082 12.1773 7.15952 11.9145 7.93443 11.9104C8.28272 11.9133 8.62872 11.967 8.96144 12.0699V8.86987C7.48875 8.89489 6.05517 9.3474 4.83545 10.1722C3.61574 10.9971 2.6626 12.1586 2.09223 13.5152C1.52186 14.8718 1.35891 16.3648 1.62323 17.8123C1.88756 19.2598 2.56775 20.5993 3.58088 21.6673C4.86758 22.5345 6.39083 22.9834 7.94271 22.9531C9.95927 22.9531 11.8935 22.1539 13.3209 20.731C14.7483 19.3084 15.552 17.3793 15.5567 15.3651Z" fill="#E5E5F5"/>
              </svg>
            </a>
            <a href="#" className="w-[72px] h-12 rounded-lg bg-gradient-to-r from-[#06100A]/56 to-[#2C764A]/0 flex items-center justify-center hover:opacity-80 transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1_486)">
                  <mask id="mask0_1_486" style={{maskType:"luminance"}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                    <path d="M24 0H0V24H24V0Z" fill="white"/>
                  </mask>
                  <g mask="url(#mask0_1_486)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.84461 4.01816C8.84461 4.01816 6.11751 3.91 3.17534 6.16444C3.17534 6.16444 0.23317 11.4778 0.23317 18.0282C0.23317 18.0282 1.86397 20.9687 6.33581 21.0803C6.33581 21.0803 6.98909 20.1795 7.64879 19.387C5.13679 18.596 4.15927 17.0142 4.15927 17.0142L4.99875 17.4638C5.16046 17.5328 5.32279 17.6031 5.48629 17.6739L5.48826 17.6747C7.80706 18.679 10.3593 19.7842 14.6824 19.0455L14.7501 19.0298C15.7051 18.807 16.6616 18.5839 17.6165 18.1414C17.7917 18.0482 17.9783 17.955 18.1744 17.857C18.6897 17.5995 19.2723 17.3083 19.8943 16.8959C19.8943 16.8959 18.9151 18.4776 16.2988 19.2686C16.8381 20.0562 17.5957 20.9586 17.5957 20.9586C21.2611 20.8755 23.0901 18.8864 23.6853 18.2392C23.8165 18.0966 23.8877 18.0191 23.9053 18.0416C23.9053 11.5014 20.9456 6.17796 20.9456 6.17796C18.3003 4.14154 15.8284 4.05027 15.3613 4.04858L15.0628 4.35786C18.4416 5.37184 20.0772 6.95536 20.0772 6.95536C15.1752 4.41362 9.8799 4.26828 5.03086 6.27599C4.26842 6.61906 3.83183 6.84382 3.83183 6.84382C3.83183 6.84382 5.46423 5.15046 9.0645 4.24631L8.84461 4.01816ZM15.6813 16.108C16.8125 16.108 17.7339 15.0684 17.7339 13.7862C17.7339 12.5127 16.8173 11.4731 15.6813 11.4731V11.4783C14.5548 11.4783 13.632 12.5144 13.6288 13.7966C13.6288 15.0684 14.55 16.108 15.6813 16.108ZM10.3862 13.7862C10.3862 15.0684 9.46498 16.108 8.33373 16.108C7.20247 16.108 6.28123 15.0684 6.28123 13.7966C6.28123 12.5144 7.20247 11.4783 8.33373 11.4783L8.34009 11.4731C9.47135 11.4731 10.3862 12.5127 10.3862 13.7862Z" fill="#E5E5F5"/>
                    <path d="M15.3709 4.04006L15.424 4.01978H15.3903L15.3709 4.04006Z" fill="#E5E5F5"/>
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_1_486">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </a>
          </div>

          {/* Payment Icons */}
          <div className="lg:ml-auto">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/b9d26cd055dc3988d65fd344f546485730a20d3a?width=778"
              alt="Payment methods"
              className="w-[389px] h-[37px] object-contain"
            />
          </div>
        </div>

        {/* Copyright and Disclaimer */}
        <div className="mt-8 pt-4 border-t border-white/10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
            <p className="text-[#7B7B7B] text-[15px] leading-[18px] max-w-lg">
              RoCart is not affiliated, endorsed by, or in any way associated with ROBLOX Corporation , Roblox.com , or any of its subsidiaries or affiliates.
            </p>
            <p className="text-[#7B7B7B] text-xs">
              © 2025 Rocart All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
