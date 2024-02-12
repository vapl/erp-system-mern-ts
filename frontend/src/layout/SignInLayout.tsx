import React, { ReactNode } from 'react';

const SignInLayout: React.FC<{ children: ReactNode }> = ({ children }) => {

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="h-screen overflow-hidden">
        {/* <!-- ===== Main Content Start ===== --> */}
        <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                {children}
            </div>
        </main>
        {/* <!-- ===== Main Content End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default SignInLayout;
