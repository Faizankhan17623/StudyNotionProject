const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "StudyNotion API",
      version: "1.0.0",
      description: "API Documentation for StudyNotion - An E-Learning Platform",
      contact: {
        name: "API Support",
        email: "support@studynotion.com",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // Auth Schemas
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", format: "password" },
          },
        },
        SignupRequest: {
          type: "object",
          required: ["firstName", "lastName", "email", "password", "confirmPassword", "accountType", "otp"],
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", format: "password" },
            confirmPassword: { type: "string", format: "password" },
            accountType: { type: "string", enum: ["Student", "Instructor", "Admin"] },
            otp: { type: "string" },
            additionalDetails: { type: "object" },
          },
        },
        SendOtpRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string", format: "email" },
          },
        },
        ChangePasswordRequest: {
          type: "object",
          required: ["oldPassword", "newPassword"],
          properties: {
            oldPassword: { type: "string" },
            newPassword: { type: "string" },
          },
        },
        ResetPasswordTokenRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string", format: "email" },
          },
        },
        ResetPasswordRequest: {
          type: "object",
          required: ["password", "confirmPassword"],
          properties: {
            password: { type: "string" },
            confirmPassword: { type: "string" },
          },
        },

        // Profile Schemas
        UpdateProfileRequest: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            dateOfBirth: { type: "string", format: "date" },
            about: { type: "string" },
            contactNumber: { type: "string" },
            gender: { type: "string", enum: ["Male", "Female", "Other"] },
          },
        },
        AddToWishlistRequest: {
          type: "object",
          required: ["courseId"],
          properties: {
            courseId: { type: "string" },
          },
        },

        // Course Schemas
        CreateCourseRequest: {
          type: "object",
          required: ["courseName", "courseDescription", "price", "category"],
          properties: {
            courseName: { type: "string" },
            courseDescription: { type: "string" },
            price: { type: "number" },
            category: { type: "string" },
            instructions: { type: "array", items: { type: "string" } },
            status: { type: "string", enum: ["Draft", "Published"] },
          },
        },
        EditCourseRequest: {
          type: "object",
          properties: {
            courseId: { type: "string" },
            courseName: { type: "string" },
            courseDescription: { type: "string" },
            price: { type: "number" },
            category: { type: "string" },
            instructions: { type: "array", items: { type: "string" } },
            status: { type: "string", enum: ["Draft", "Published"] },
          },
        },
        SectionRequest: {
          type: "object",
          required: ["sectionName", "courseId"],
          properties: {
            sectionName: { type: "string" },
            courseId: { type: "string" },
          },
        },
        SubSectionRequest: {
          type: "object",
          required: ["sectionId", "title", "timeDuration", "videoUrl"],
          properties: {
            sectionId: { type: "string" },
            title: { type: "string" },
            timeDuration: { type: "string" },
            description: { type: "string" },
            videoUrl: { type: "string" },
          },
        },
        GetCourseDetailsRequest: {
          type: "object",
          properties: {
            courseId: { type: "string" },
          },
        },
        SearchCoursesRequest: {
          type: "object",
          properties: {
            searchQuery: { type: "string" },
            category: { type: "string" },
            level: { type: "string" },
            price: { type: "string" },
            sortBy: { type: "string" },
          },
        },
        UpdateProgressRequest: {
          type: "object",
          required: ["courseId", "subsectionId"],
          properties: {
            courseId: { type: "string" },
            subsectionId: { type: "string" },
          },
        },
        VideoTimestampRequest: {
          type: "object",
          required: ["courseId", "subsectionId", "timeStamp"],
          properties: {
            courseId: { type: "string" },
            subsectionId: { type: "string" },
            timeStamp: { type: "number" },
          },
        },
        CreateCategoryRequest: {
          type: "object",
          required: ["name", "description"],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
          },
        },
        CreateRatingRequest: {
          type: "object",
          required: ["courseId", "rating", "review"],
          properties: {
            courseId: { type: "string" },
            rating: { type: "integer", minimum: 1, maximum: 5 },
            review: { type: "string" },
          },
        },

        // Payment Schemas
        CapturePaymentRequest: {
          type: "object",
          required: ["courseId"],
          properties: {
            courseId: { type: "string" },
          },
        },
        VerifyPaymentRequest: {
          type: "object",
          required: ["razorpay_payment_id", "razorpay_order_id", "razorpay_signature"],
          properties: {
            razorpay_payment_id: { type: "string" },
            razorpay_order_id: { type: "string" },
            razorpay_signature: { type: "string" },
          },
        },

        // Contact Schemas
        ContactRequest: {
          type: "object",
          required: ["firstName", "lastName", "email", "phone", "message"],
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
            phone: { type: "string" },
            message: { type: "string" },
          },
        },

        // Maintenance Schemas
        SetMaintenanceRequest: {
          type: "object",
          required: ["isMaintenanceMode"],
          properties: {
            isMaintenanceMode: { type: "boolean" },
          },
        },
        NotifyMaintenanceRequest: {
          type: "object",
          required: ["title", "message"],
          properties: {
            title: { type: "string" },
            message: { type: "string" },
          },
        },

        // Response Schemas
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        CourseResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
          },
        },
      },
    },
    paths: {
      // ==================== AUTH ROUTES ====================
      "/api/v1/auth/signup": {
        post: {
          tags: ["Authentication"],
          summary: "Register a new user",
          description: "Register a new user with email, password, and account type",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SignupRequest" },
              },
            },
          },
          responses: {
            200: { description: "User registered successfully" },
            400: { description: "Bad request", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/auth/login": {
        post: {
          tags: ["Authentication"],
          summary: "User login",
          description: "Authenticate user and return JWT token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: { description: "Login successful" },
            401: { description: "Invalid credentials" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/auth/sendotp": {
        post: {
          tags: ["Authentication"],
          summary: "Send OTP to email",
          description: "Generate and send OTP to user's email for verification",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SendOtpRequest" },
              },
            },
          },
          responses: {
            200: { description: "OTP sent successfully" },
            400: { description: "Bad request" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/auth/changepassword": {
        post: {
          tags: ["Authentication"],
          summary: "Change user password",
          description: "Change password using current password",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChangePasswordRequest" },
              },
            },
          },
          responses: {
            200: { description: "Password changed successfully" },
            401: { description: "Invalid current password" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/auth/reset-password-token": {
        post: {
          tags: ["Authentication"],
          summary: "Generate password reset token",
          description: "Generate a token to reset password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ResetPasswordTokenRequest" },
              },
            },
          },
          responses: {
            200: { description: "Reset token sent to email" },
            404: { description: "User not found" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/auth/reset-password": {
        post: {
          tags: ["Authentication"],
          summary: "Reset password",
          description: "Reset password using reset token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ResetPasswordRequest" },
              },
            },
          },
          responses: {
            200: { description: "Password reset successfully" },
            400: { description: "Invalid or expired token" },
            500: { description: "Internal server error" },
          },
        },
      },

      // ==================== PROFILE ROUTES ====================
      "/api/v1/profile/getUserDetails": {
        get: {
          tags: ["Profile"],
          summary: "Get user details",
          description: "Get authenticated user's profile details",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "User details fetched successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/profile/updateProfile": {
        put: {
          tags: ["Profile"],
          summary: "Update user profile",
          description: "Update authenticated user's profile information",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateProfileRequest" },
              },
            },
          },
          responses: {
            200: { description: "Profile updated successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/profile/deleteProfile": {
        delete: {
          tags: ["Profile"],
          summary: "Delete user profile",
          description: "Delete authenticated user's account",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Profile deleted successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/profile/getEnrolledCourses": {
        get: {
          tags: ["Profile"],
          summary: "Get enrolled courses",
          description: "Get all courses the user is enrolled in",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Enrolled courses fetched successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/profile/updateDisplayPicture": {
        put: {
          tags: ["Profile"],
          summary: "Update display picture",
          description: "Update user's profile picture",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    image: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Display picture updated successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/profile/instructorDashboard": {
        get: {
          tags: ["Profile"],
          summary: "Get instructor dashboard",
          description: "Get instructor's dashboard data including course stats",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Dashboard data fetched successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden - Instructor role required" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/profile/addToWishlist": {
        post: {
          tags: ["Profile"],
          summary: "Add course to wishlist",
          description: "Add a course to user's wishlist",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AddToWishlistRequest" },
              },
            },
          },
          responses: {
            200: { description: "Course added to wishlist" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/profile/removeFromWishlist": {
        delete: {
          tags: ["Profile"],
          summary: "Remove course from wishlist",
          description: "Remove a course from user's wishlist",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "courseId",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Course removed from wishlist" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/profile/getWishlist": {
        get: {
          tags: ["Profile"],
          summary: "Get user wishlist",
          description: "Get all courses in user's wishlist",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Wishlist fetched successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/profile/getCertificate/{courseId}": {
        get: {
          tags: ["Profile"],
          summary: "Get course completion certificate",
          description: "Get certificate for completed course",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "courseId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Certificate generated" },
            401: { description: "Unauthorized" },
            404: { description: "Course not completed" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/profile/instructorProfile/{instructorId}": {
        get: {
          tags: ["Profile"],
          summary: "Get instructor public profile",
          description: "Get public profile of an instructor",
          parameters: [
            {
              name: "instructorId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Instructor profile fetched" },
            404: { description: "Instructor not found" },
            500: { description: "Internal server error" },
          },
        },
      },

      // ==================== COURSE ROUTES ====================
      "/api/v1/course/createCourse": {
        post: {
          tags: ["Courses"],
          summary: "Create a new course",
          description: "Create a new course (Instructor only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateCourseRequest" },
              },
            },
          },
          responses: {
            200: { description: "Course created successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden - Instructor role required" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/editCourse": {
        post: {
          tags: ["Courses"],
          summary: "Edit a course",
          description: "Edit an existing course (Instructor only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/EditCourseRequest" },
              },
            },
          },
          responses: {
            200: { description: "Course edited successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/getAllCourses": {
        get: {
          tags: ["Courses"],
          summary: "Get all courses",
          description: "Get all published courses",
          responses: {
            200: { description: "Courses fetched successfully" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/getInstructorCourses": {
        get: {
          tags: ["Courses"],
          summary: "Get instructor courses",
          description: "Get all courses created by the instructor",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Instructor courses fetched" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/getCourseDetails": {
        post: {
          tags: ["Courses"],
          summary: "Get course details",
          description: "Get details of a specific course",
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GetCourseDetailsRequest" },
              },
            },
          },
          responses: {
            200: { description: "Course details fetched" },
            404: { description: "Course not found" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/getFullCourseDetails": {
        post: {
          tags: ["Courses"],
          summary: "Get full course details",
          description: "Get full details of a course including sections (requires auth for enrolled students)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GetCourseDetailsRequest" },
              },
            },
          },
          responses: {
            200: { description: "Full course details fetched" },
            401: { description: "Unauthorized" },
            404: { description: "Course not found" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/searchCourses": {
        get: {
          tags: ["Courses"],
          summary: "Search and filter courses",
          description: "Search courses with filters",
          parameters: [
            {
              name: "searchQuery",
              in: "query",
              schema: { type: "string" },
            },
            {
              name: "category",
              in: "query",
              schema: { type: "string" },
            },
            {
              name: "level",
              in: "query",
              schema: { type: "string" },
            },
            {
              name: "price",
              in: "query",
              schema: { type: "string" },
            },
            {
              name: "sortBy",
              in: "query",
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Search results fetched" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/addSection": {
        post: {
          tags: ["Courses"],
          summary: "Add section to course",
          description: "Add a new section to a course (Instructor only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SectionRequest" },
              },
            },
          },
          responses: {
            200: { description: "Section added successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/updateSection": {
        post: {
          tags: ["Courses"],
          summary: "Update section",
          description: "Update a section in a course (Instructor only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["sectionId", "sectionName"],
                  properties: {
                    sectionId: { type: "string" },
                    sectionName: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Section updated successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/deleteSection": {
        post: {
          tags: ["Courses"],
          summary: "Delete section",
          description: "Delete a section from a course (Instructor only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["sectionId"],
                  properties: {
                    sectionId: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Section deleted successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/addSubSection": {
        post: {
          tags: ["Courses"],
          summary: "Add subsection to section",
          description: "Add a new video/content to a section (Instructor only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SubSectionRequest" },
              },
            },
          },
          responses: {
            200: { description: "Subsection added successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/updateSubSection": {
        post: {
          tags: ["Courses"],
          summary: "Update subsection",
          description: "Update a subsection (Instructor only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["subsectionId"],
                  properties: {
                    subsectionId: { type: "string" },
                    title: { type: "string" },
                    timeDuration: { type: "string" },
                    description: { type: "string" },
                    videoUrl: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Subsection updated successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/deleteSubSection": {
        post: {
          tags: ["Courses"],
          summary: "Delete subsection",
          description: "Delete a subsection (Instructor only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["subsectionId"],
                  properties: {
                    subsectionId: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Subsection deleted successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/updateCourseProgress": {
        post: {
          tags: ["Courses"],
          summary: "Update course progress",
          description: "Mark a subsection as completed (Student only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateProgressRequest" },
              },
            },
          },
          responses: {
            200: { description: "Progress updated" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/updateVideoTimestamp": {
        post: {
          tags: ["Courses"],
          summary: "Save video timestamp",
          description: "Save the current video playback position (Student only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/VideoTimestampRequest" },
              },
            },
          },
          responses: {
            200: { description: "Timestamp saved" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/getVideoTimestamp": {
        get: {
          tags: ["Courses"],
          summary: "Get video timestamp",
          description: "Get saved video playback position (Student only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "courseId",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
            {
              name: "subsectionId",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Timestamp fetched" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/deleteCourse": {
        delete: {
          tags: ["Courses"],
          summary: "Delete a course",
          description: "Delete a course (Instructor only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "courseId",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Course deleted successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/createCategory": {
        post: {
          tags: ["Courses"],
          summary: "Create a category",
          description: "Create a new course category (Admin only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateCategoryRequest" },
              },
            },
          },
          responses: {
            200: { description: "Category created successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden - Admin role required" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/showAllCategories": {
        get: {
          tags: ["Courses"],
          summary: "Get all categories",
          description: "Get all course categories",
          responses: {
            200: { description: "Categories fetched successfully" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/getCategoryPageDetails": {
        post: {
          tags: ["Courses"],
          summary: "Get category page details",
          description: "Get courses and details for a specific category",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    categoryId: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Category details fetched" },
            404: { description: "Category not found" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/createRating": {
        post: {
          tags: ["Courses"],
          summary: "Create rating/review",
          description: "Rate and review a course (Student only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateRatingRequest" },
              },
            },
          },
          responses: {
            200: { description: "Rating created successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/getAverageRating": {
        get: {
          tags: ["Courses"],
          summary: "Get average rating",
          description: "Get average rating for a course",
          parameters: [
            {
              name: "courseId",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Average rating fetched" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/getReviews": {
        get: {
          tags: ["Courses"],
          summary: "Get all reviews",
          description: "Get all reviews for a course",
          parameters: [
            {
              name: "courseId",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Reviews fetched successfully" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/course/deleteReview": {
        delete: {
          tags: ["Courses"],
          summary: "Delete a review",
          description: "Delete a review (Admin only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "reviewId",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Review deleted successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden - Admin role required" },
            500: { description: "Internal server error" },
          },
        },
      },

      // ==================== PAYMENT ROUTES ====================
      "/api/v1/payment/capturePayment": {
        post: {
          tags: ["Payment"],
          summary: "Capture payment",
          description: "Initiate payment for a course (Student only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CapturePaymentRequest" },
              },
            },
          },
          responses: {
            200: { description: "Payment initiated successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/payment/verifyPayment": {
        post: {
          tags: ["Payment"],
          summary: "Verify payment",
          description: "Verify Razorpay payment signature (Student only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/VerifyPaymentRequest" },
              },
            },
          },
          responses: {
            200: { description: "Payment verified successfully" },
            401: { description: "Unauthorized" },
            400: { description: "Invalid signature" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/payment/sendPaymentSuccessEmail": {
        post: {
          tags: ["Payment"],
          summary: "Send payment success email",
          description: "Send payment confirmation email (Student only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["paymentId", "orderId", "amount"],
                  properties: {
                    paymentId: { type: "string" },
                    orderId: { type: "string" },
                    amount: { type: "number" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Email sent successfully" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },

      // ==================== CONTACT ROUTES ====================
      "/api/v1/reach/contact": {
        post: {
          tags: ["Contact"],
          summary: "Contact us",
          description: "Submit contact form",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactRequest" },
              },
            },
          },
          responses: {
            200: { description: "Message sent successfully" },
            500: { description: "Internal server error" },
          },
        },
      },

      // ==================== MAINTENANCE ROUTES ====================
      "/api/v1/maintenance/status": {
        get: {
          tags: ["Maintenance"],
          summary: "Get maintenance status",
          description: "Get current maintenance mode status",
          responses: {
            200: { description: "Maintenance status fetched" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/maintenance/set": {
        post: {
          tags: ["Maintenance"],
          summary: "Set maintenance mode",
          description: "Enable or disable maintenance mode (Admin only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SetMaintenanceRequest" },
              },
            },
          },
          responses: {
            200: { description: "Maintenance mode updated" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden - Admin role required" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/v1/maintenance/notify": {
        post: {
          tags: ["Maintenance"],
          summary: "Notify users about maintenance",
          description: "Send maintenance notification to users (Admin only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/NotifyMaintenanceRequest" },
              },
            },
          },
          responses: {
            200: { description: "Notification sent successfully" },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden - Admin role required" },
            500: { description: "Internal server error" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js", "./index.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
