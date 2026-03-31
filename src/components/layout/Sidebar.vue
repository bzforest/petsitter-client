<template>
    <aside class="w-[240px] h-screen bg-white border-r flex flex-col justify-between">
      
      <!-- TOP -->
      <div>
        <!-- Logo -->
        <div class="h-[64px] flex items-center px-6 text-xl font-bold text-orange-500">
          Sitter*
        </div>
  
        <!-- Menu -->
        <nav class="mt-4 flex flex-col gap-2 px-3">
  
          <RouterLink to="/profile" class="menu-item active">
            Pet Sitter Profile
          </RouterLink>
  
          <RouterLink to="/booking" class="menu-item">
            Booking List
          </RouterLink>
  
          <RouterLink to="/calendar" class="menu-item">
            Calendar
          </RouterLink>
  
          <RouterLink to="/payout" class="menu-item">
            Payout Option
          </RouterLink>
  
        </nav>
      </div>
  
      <!-- BOTTOM -->
      <div class="p-4 border-t text-sm text-gray-500 cursor-pointer hover:text-black">
        Log out
      </div>
  
    </aside>
  </template>
  
  <style scoped>
  .menu-item {
    padding: 10px 12px;
    border-radius: 8px;
    color: #6b7280;
  }
  
  .menu-item:hover {
    background: #f3f4f6;
  }
  
  .active {
    background: #fff1eb;
    color: #f97316;
    font-weight: 500;
  }
  </style>