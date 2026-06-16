import React from 'react';
import { ShoppingBag, Star, Package, Heart, User, ChevronRight } from 'lucide-react';

export default function BoutiqueDashboard() {
  return (
    <div 
      className="relative w-full h-full min-h-screen overflow-y-auto font-sans text-gray-900"
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: "linear-gradient(135deg, #f5f3f0 0%, #e2dddb 100%)",
        backgroundImage: "url('https://lh3.googleusercontent.com/aida/AP1WRLvfgCCTIlxlMcuWvrwPkKSHMf6J6tYkYp9KucbkrGUQQxfgjbfXXqoM7NRhGg1VwGmSYX5-v5CAZszaLlpPtQr3N2LwljNcVKYPUbjhy9qdaFdGcYrmApApEtilz00JdP6Ff00yALFqZgZqYMh3aeHRbTrRLI8qZQwv00_VCNJlUanZeirFlXqMX1YjcIb-yzFpqaWfeIT1tTTpDsqbkGE2pzFCY4hbUn2HWBxU8MXRP5Tl6u8zmt749g')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="relative z-10 p-8 flex flex-col h-full">
        
        {/* Header */}
        <header className="mb-8 shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-semibold text-black mb-2 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Zafir Luxury Boutique</h1>
            <p className="text-gray-700 text-lg font-medium">Zafir Command Center: Pôle Opérations</p>
          </div>
          
          <div className="flex gap-4">
             {/* Stats or extra header content could go here */}
          </div>
        </header>

        <div className="flex gap-6 flex-1 items-start">
          
          {/* Main Column */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Featured Collections */}
            <section className="glass-panel rounded-[2rem] p-6">
              <h2 className="text-2xl mb-6 text-gray-900 tracking-tight font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>Featured Collections</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Collection Card 1 */}
                <article className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer shadow-sm border border-black/5">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB8jT1TOtshzPiqS1JAzYo4xsRqLEQvzUAf02EDdfrXV51PPb4z6hTAl-gNK6mttnoz5TJb-nl-GAX3tfCEXAVuX-dc0_J29a8WkOh4duZtrpqn6FmdyxBe_8Ynew5m2M6PZkWw4eZejJvMQPR8sPtv_l6hlDqcbvPdaa9bPnDrYLK2hhDHfpgEp8jebiQnUxl4EBfX4A5zbNexWAmCGqO7y7u9eW4KLkMoprj2f3HZTqz53uxCNOuAW7P5gYKriOQH_IDqCsHbOGo')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-white text-xl mb-3 font-medium shadow-sm">Signature Scents</h3>
                    <button className="bg-white/90 text-gray-900 px-5 py-2 rounded-full text-sm font-medium hover:bg-white transition-colors shadow-sm">Shop Now</button>
                  </div>
                </article>

                {/* Collection Card 2 */}
                <article className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer shadow-sm border border-black/5">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCz6sziDpdVHK99VoEMXNGoyFIfArHRTgDDKZB0yFBx5vQVgh8ABxszbxLRp_fIdB5NIbh7GiXs1sQFsBWJPQoGi5OwUcZ2QU1ioOP0aB7TVHTh-BxutcCXYgQ8l10CxL0LYtQJfkYo9zobZoa7qpVURIyzRdYSzMMjmvjAi77O2e_VOOtqFrohPWupxcAJV7d_ZXzKnzJlCDugtOaC-JaCSYajS51tHi6Lix5fS88RcRrAO6pTCteyZSOBPg7g6sZrUdtzn-4CFWY')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-white text-xl mb-3 font-medium shadow-sm">Indulgence Robes</h3>
                    <button className="bg-white/90 text-gray-900 px-5 py-2 rounded-full text-sm font-medium hover:bg-white transition-colors shadow-sm">Shop Now</button>
                  </div>
                </article>

                {/* Collection Card 3 */}
                <article className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer shadow-sm border border-black/5">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB_Zs_13IuThkURShhiq82XVldlNLY5619KYalBmhhGP0oGagP-FodHc3bCxbV5f9SEbndUz_pPOpQJrVDCK_vwb46K1ygewtjCK6O_UFBVGO3H88UK2MGNy1Byr6H9816-S5To6Pao1F0nGhjvk-F_UvdOzo4J780y-94gOCTw0MaCnUzjznyjNVAJG8XrmA0N6nKcpDUH8XAyqRp73h-E3LS6ldW9iOPZ1Os2pAMwkjnKq1jeCEAYAm9uqJnyDEy8UDo7nYK1Lfk')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-white text-xl mb-3 font-medium shadow-sm">Premium Amenities</h3>
                    <button className="bg-white/90 text-gray-900 px-5 py-2 rounded-full text-sm font-medium hover:bg-white transition-colors shadow-sm">Shop Now</button>
                  </div>
                </article>

              </div>
            </section>

            {/* Bottom Panels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Checkout Panel */}
              <section className="glass-card rounded-[2rem] p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <h2 className="text-xl mb-5 text-gray-900 font-medium tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Ultra-fast Checkout</h2>
                  <div className="flex justify-between items-center mb-2 text-sm text-gray-700">
                    <span>Cart items × 1</span>
                    <span className="font-medium text-gray-900">$120</span>
                  </div>
                  <div className="flex justify-between items-center mb-5 text-sm text-gray-700">
                    <span>Discount</span>
                    <span className="font-medium text-gray-500">- $3</span>
                  </div>
                  <div className="mb-6 pt-4 border-t border-gray-200/60">
                    <p className="text-xs text-gray-500 mb-1">Shipping Address:</p>
                    <p className="text-sm font-medium text-gray-800">123 Civoco, Ki way</p>
                  </div>
                </div>
                <button className="w-full bg-black text-white rounded-full py-3.5 px-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-md mt-4">
                  <span className="text-sm font-medium">Pay with</span>
                  <span className="font-bold">Apple Pay</span>
                </button>
              </section>

              {/* Orders Panel */}
              <section className="glass-card rounded-[2rem] p-6 shadow-sm">
                <h2 className="text-xl mb-5 text-gray-900 font-medium tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Your Orders</h2>
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden shrink-0 border border-black/5">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVnVu2DrM_eGQvAstO8hXWOFjT42AYasj9_9TSFCK6ZL07Vu7Usm8jgZlSBFLxyeAsu1OXLJMoBGS5eOkbw2dhWkMbmufyIuukKe-bHt3dyHRu8ypAOpz17-IifvHi3KzTJ3sg_E9kmHYOgIGLQJMpnk7KSUF0qeBd4bBSLVfBx_1RZbhBeZ4d8d-T8JgYAb78VyTuh9mafti_FUvm45rWaP3OpFzTzWKsBuefIkxt0vTLKV2_A_nxDur2VVTLNyRnwGFJa17PjnQ" className="w-full h-full object-cover" alt="Order 1" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Signature Scent...</p>
                      <p className="text-xs text-gray-500 mt-0.5">$120</p>
                    </div>
                    <span className="text-xs font-medium text-gray-700 bg-white/60 border border-gray-200 px-2.5 py-1 rounded-md shadow-sm">Status</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden shrink-0 border border-black/5">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-XcuaxUbVkYbBgCyN_0XKOBR-hxZ1vdYkby6QCj3KKuIOnROcZCfOIinWSn0DNivL7sqTOOS9cWbNxBo5GoLQjpLPFN18BWmJs9qERCNze8PWF19g35mDaqn18-BPSEq8bJ4A3d-jk7K3BdjvYdFdm1UdBigeQg5EZmG62C--c-pSLxaqo0JxO2KuBjI1iAk5sJYbwEv-ylJz9TSAdeJiZ4bSaiX8vqwp_mnLIV5MWkEECPy1W_hsg-lPIFao7WoyicOj2zR9kkk" className="w-full h-full object-cover" alt="Order 2" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Indulgence Ro...</p>
                      <p className="text-xs text-gray-500 mt-0.5">$450</p>
                    </div>
                    <span className="text-xs font-medium text-gray-700 bg-white/60 border border-gray-200 px-2.5 py-1 rounded-md shadow-sm">Status</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden shrink-0 border border-black/5">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiydKDm1jzijvnzGBZT7w3IHtRombwsMnHMIUNW0tX6vjnwx2Ub6yO2gD0L_emOT5hS2tUXrBi9cULNdKYCCy9sHu3N_WWwmLn3yb7vZcCkD9uASRlNuwlkS1GiTAeBCXOpiSDJnUlXM5PG002Adnh38sQyivZRe61QkaDTQuOSxixIP_exd16DN94OZ4hPk7AKSdYB7HcbpwGVfbj87SBfDxNMMctw7ooR6MsErKVQPyujb4mJUZ3moZ-LyL3pDYPqanSE-CcXxA" className="w-full h-full object-cover" alt="Order 3" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Premium Ame...</p>
                      <p className="text-xs text-gray-500 mt-0.5">$300</p>
                    </div>
                    <span className="text-xs font-medium text-gray-700 bg-white/60 border border-gray-200 px-2.5 py-1 rounded-md shadow-sm">Status</span>
                  </div>
                </div>
              </section>

              {/* Account & Rewards */}
              <section className="glass-card rounded-[2rem] p-6 shadow-sm flex flex-col">
                <h2 className="text-xl mb-4 text-gray-900 font-medium tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Account & Rewards</h2>
                <div className="mb-6">
                  <p className="text-4xl text-gray-900 font-semibold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>130 <span className="text-xl font-normal text-gray-600" style={{ fontFamily: "'Outfit', sans-serif" }}>Points</span></p>
                  <p className="text-sm text-gray-500 mt-1 border-b border-gray-200/60 pb-4">Loyalty points</p>
                </div>
                <div className="flex-grow flex flex-col justify-end space-y-3 pt-2">
                  <a className="flex justify-between items-center text-sm font-medium text-gray-700 hover:text-black py-1.5 transition-colors" href="#">
                    <span>Profile settings</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </a>
                  <a className="flex justify-between items-center text-sm font-medium text-gray-700 hover:text-black py-1.5 transition-colors" href="#">
                    <span>Manage account</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </a>
                  <a className="flex justify-between items-center text-sm font-medium text-gray-700 hover:text-black py-1.5 transition-colors" href="#">
                    <span>Profile options</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </a>
                </div>
              </section>

            </div>
          </div>
          
          {/* Right Sidebar: Best Sellers */}
          <aside className="glass-panel w-80 shrink-0 rounded-[2rem] p-6 shadow-sm border border-black/5">
            <h2 className="text-2xl mb-6 text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Best Sellers</h2>
            
            <div className="grid grid-cols-2 gap-5">
              
              <div className="group cursor-pointer">
                <div className="bg-[#f0ece9] rounded-2xl aspect-square mb-3 flex items-center justify-center p-3 overflow-hidden border border-black/5">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5knDpzAc-gETCdANle4vm656FAwQmPDDdOxqY7d_9Am1IkOxqK-vF69GoMb3JOz1rr685XJRApfyTbg7R4A1oFzxyXWqeaj6yNEZqLBbk1VHcoksWsOeZrV8QH-fqKVTpRfPXKmbU0NQt9PO-Uljn4PPG7jqL-Xwgv9x7kLK-kGnZQL1t9v6Qplcq3p2W26YrChPrj0NvI_g4azHVbIVEQvIzWOWTwIN6XqeSEPftyyHoJHRRI1AcavZmnp2WMZYDcdC5kfE7_mU" alt="Silk Eye Mask" className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" />
                </div>
                <h4 className="text-sm font-medium leading-tight mb-1">Zafir Silk Eye Mask</h4>
                <p className="text-sm font-semibold text-gray-600">$120</p>
              </div>

              <div className="group cursor-pointer">
                <div className="bg-[#f0ece9] rounded-2xl aspect-square mb-3 flex items-center justify-center overflow-hidden border border-black/5">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuATKmotzdTlM2DW1V5Kz4u8sXq6I0uTNeJUwjK0V97m2Ub8P94D1bQOtpRUOnHP1PblTkoOscPo2zGf-_fdS7BJKSGm_lqVEndYNVO7eVHIFzh6W33wpnDH4wiFnY6NmAl91bNxstMy8sjAL7LHcjBMRGylrAJRaFJNNOAzwhh_Sl4yv4tUwjbc9DXATlRXxawV99Z4xaZ5ATrlznOP8R09X1rvH4M6p8XFgJf8VZTDrgTQXV_ShYPO_rTHKJDT1m0HN_xwS0O60Q0" alt="Cashmere Throw" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h4 className="text-sm font-medium leading-tight mb-1">Cashmere Throw</h4>
                <p className="text-sm font-semibold text-gray-600">$450</p>
              </div>

              <div className="group cursor-pointer">
                <div className="bg-[#f0ece9] rounded-2xl aspect-square mb-3 flex items-center justify-center overflow-hidden border border-black/5">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBagQvEeNbTW-F5ksSs2CoWu5Mr4Oe4CYT20SvSYZNekfLe_UxUMKOe1_a_jicB1P5E3Nr_T1Y6R7Z9n0c4KpRUgw02ZFvkFWL86fEwTa7RzNjnOBYAGLcR-FcMKvuvbu29tmmR2WffiZ6ecPZi81dQORNTdjboiNGCsqJoxb57np26c9t_jXJ8euZ1pQ3hrUOSOjuKANC6MqGVCNl4jOvZ0kycFwLB_4IWiF-j6XzAlvszbSycosTG9K-gsm5KZsqa92bTP29jiRA" alt="Leather Travel Kit" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h4 className="text-sm font-medium leading-tight mb-1">Leather Travel Kit</h4>
                <p className="text-sm font-semibold text-gray-600">$300</p>
              </div>

              <div className="group cursor-pointer">
                <div className="bg-[#f0ece9] rounded-2xl aspect-square mb-3 flex items-center justify-center overflow-hidden border border-black/5">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBax3Dn3JLiEW1rGwEpHmprRfUXQapi3TNYKin-wNG1iyDiRkNLInPYqMcNs-hoURi5R1v6Uw4bfFt_8_prvoLuFocusUMWuHQd96N7v-eImPfuv0tR9GAjQ38dw167QPOqqLoux9O9qKYJfMRUMQCPggG1lcMrL6EFNDzskiApXpCrf-agJl2pCAkAb_41KJKx4eeo5jL8LEhkgmOwXlVlHHjI4b4ey0CJNI4q_ykXK2RyoWaSQtE_wK3Rvosr2Bqyu0KGVwbJGg8" alt="Aromatherapy Diffuser" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h4 className="text-sm font-medium leading-tight mb-1">Aroma Diffuser</h4>
                <p className="text-sm font-semibold text-gray-600">$250</p>
              </div>
              
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
}
