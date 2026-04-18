import React from 'react';
import { Shield, Award, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary-900 dark:text-white mb-6">About CIT-ES</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-20">
          <div className="text-center p-6 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
            <Shield className="w-12 h-12 text-accent-500 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-primary-900 dark:text-white mb-3">Trust & Security</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
            </p>
          </div>
          <div className="text-center p-6 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
            <Award className="w-12 h-12 text-accent-500 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-primary-900 dark:text-white mb-3">Premium Quality</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className="text-center p-6 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
            <Users className="w-12 h-12 text-accent-500 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-primary-900 dark:text-white mb-3">Expert Team</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
            </p>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-3xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-heading font-bold text-primary-900 dark:text-white mb-6">Our Story</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
            </p>
          </div>
          <div className="flex-1 w-full relative">
             <div className="aspect-[4/3] bg-neutral-200 dark:bg-neutral-700 rounded-2xl flex items-center justify-center">
                 <img src="/cit-logo (3).png" alt="CIT-ES" className="w-1/2 h-1/2 object-contain" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
