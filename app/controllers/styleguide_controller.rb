# frozen_string_literal: true

# Development-only page showing every UI component in the current palette.
# The route only exists in development (see config/routes.rb).
class StyleguideController < InertiaController
  def index
    render inertia: { sample_rent_pesewas: 19_200_00 }
  end
end
