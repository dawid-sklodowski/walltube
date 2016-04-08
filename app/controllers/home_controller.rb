class HomeController < ApplicationController
  after_action :allow_facebook_iframe, only: :facebook

  def facebook;end

  def facebook_user

    user_data = {
      fb_user_id: params[:user][:id],
      fb_user_first_name: params[:user][:first_name],
      fb_user_last_name: params[:user][:last_name],
      youtube_ids: params[:youtubeIds],
    }

    user = User.where(fb_user_id: user_data[:fb_user_id]).last

    if user.present?
      user.update_attributes!(user_data)
    else
      User.create!(user_data)
    end

    render nothing: true
  end

  private

  def allow_facebook_iframe
    response.headers.delete('X-Frame-Options')
  end
end
